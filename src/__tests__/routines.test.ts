/**
 * Integration tests for the routine library, the weekly schedule, and swapping
 * a different routine into today. Runs inside workerd via vitest-pool-workers.
 */

import { SELF, env } from "cloudflare:test";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createTestUser,
  loginAs,
  formBodyWithCsrf,
  type TestUser,
} from "./helpers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function post(
  path: string,
  cookies: string,
  data: Record<string, string> = {}
): Promise<Response> {
  const { body, csrfCookie } = formBodyWithCsrf(data);
  return SELF.fetch(`http://localhost${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: `${cookies}; ${csrfCookie}`,
    },
    body,
    redirect: "manual",
  });
}

/** Like post(), but for bodies that repeat a field name (e.g. "item_ids[]"). */
async function postMulti(
  path: string,
  cookies: string,
  pairs: [string, string][]
): Promise<Response> {
  const csrfToken = crypto.randomUUID();
  const params = new URLSearchParams(pairs);
  params.append("_csrf", csrfToken);
  return SELF.fetch(`http://localhost${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: `${cookies}; csrf_token=${csrfToken}`,
    },
    body: params.toString(),
    redirect: "manual",
  });
}

async function get(path: string, cookies: string): Promise<Response> {
  return SELF.fetch(`http://localhost${path}`, {
    headers: { Cookie: cookies },
    redirect: "manual",
  });
}

/** Creates a routine and returns its id (taken from the redirect target). */
async function createRoutine(cookies: string, name: string): Promise<string> {
  const res = await post("/routines", cookies, { name });
  expect(res.status).toBe(302);
  const location = res.headers.get("Location") ?? "";
  expect(location).toMatch(/^\/routines\/[0-9a-f-]{36}$/);
  return location.split("/").pop()!;
}

async function addLift(
  cookies: string,
  routineId: string,
  liftName: string
): Promise<Response> {
  return post(`/routines/${routineId}/items`, cookies, {
    lift_name: liftName,
    reps_min: "8",
    reps_max: "12",
    sets: "3",
  });
}

const todayWeekday = () => new Date().getDay();
const todayIso = () => new Date().toISOString().split("T")[0];

async function deleteTestUser(id: string) {
  await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Routine library", () => {
  let user: TestUser;
  let cookies: string;

  beforeEach(async () => {
    user = await createTestUser();
    cookies = await loginAs(user.username, user.password);
  });

  afterEach(async () => {
    await deleteTestUser(user.id);
  });

  it("creates routines that are not tied to any weekday", async () => {
    const id = await createRoutine(cookies, "Chest & Back — Barbell");

    const row = await env.DB.prepare("SELECT name FROM routines WHERE id = ?")
      .bind(id)
      .first<{ name: string }>();
    expect(row?.name).toBe("Chest & Back — Barbell");

    const scheduled = await env.DB.prepare(
      "SELECT count(*) AS n FROM routine_schedule WHERE routine_id = ?"
    )
      .bind(id)
      .first<{ n: number }>();
    expect(scheduled?.n).toBe(0);
  });

  it("allows many routines, unlike the old one-per-weekday model", async () => {
    for (const name of ["A", "B", "C", "D", "E", "F", "G", "H"]) {
      await createRoutine(cookies, name);
    }
    const res = await get("/routines", cookies);
    const html = await res.text();
    expect(res.status).toBe(200);
    for (const name of ["A", "B", "C", "D", "E", "F", "G", "H"]) {
      expect(html).toContain(`>${name}</option>`);
    }
  });

  it("assigns a routine to a weekday and clears it again", async () => {
    const id = await createRoutine(cookies, "Leg Day");

    const assign = await post("/routines/schedule/3", cookies, { routine_id: id });
    expect(assign.status).toBe(200);

    let row = await env.DB.prepare(
      "SELECT routine_id FROM routine_schedule WHERE user_id = ? AND weekday = 3"
    )
      .bind(user.id)
      .first<{ routine_id: string }>();
    expect(row?.routine_id).toBe(id);

    const clear = await post("/routines/schedule/3", cookies, { routine_id: "" });
    expect(clear.status).toBe(200);

    row = await env.DB.prepare(
      "SELECT routine_id FROM routine_schedule WHERE user_id = ? AND weekday = 3"
    )
      .bind(user.id)
      .first<{ routine_id: string }>();
    expect(row).toBeNull();
  });

  it("schedules one routine on multiple weekdays", async () => {
    const id = await createRoutine(cookies, "Full Body");
    await post("/routines/schedule/1", cookies, { routine_id: id });
    await post("/routines/schedule/4", cookies, { routine_id: id });

    const rows = await env.DB.prepare(
      "SELECT weekday FROM routine_schedule WHERE routine_id = ? ORDER BY weekday"
    )
      .bind(id)
      .all<{ weekday: number }>();
    expect(rows.results.map((r) => r.weekday)).toEqual([1, 4]);
  });

  it("duplicates a routine with independent items and superset groups", async () => {
    const id = await createRoutine(cookies, "Push");
    await addLift(cookies, id, "Bench Press");
    await addLift(cookies, id, "Overhead Press");

    const items = await env.DB.prepare(
      "SELECT id FROM routine_items WHERE routine_id = ?"
    )
      .bind(id)
      .all<{ id: string }>();
    const { body, csrfCookie } = formBodyWithCsrf({});
    const supersetBody =
      body +
      "&" +
      items.results.map((i) => `item_ids[]=${i.id}`).join("&");
    await SELF.fetch(`http://localhost/routines/${id}/superset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: `${cookies}; ${csrfCookie}`,
      },
      body: supersetBody,
      redirect: "manual",
    });

    const dup = await post(`/routines/${id}/duplicate`, cookies);
    expect(dup.status).toBe(302);
    const copyId = dup.headers.get("Location")!.split("/").pop()!;
    expect(copyId).not.toBe(id);

    const copy = await env.DB.prepare("SELECT name FROM routines WHERE id = ?")
      .bind(copyId)
      .first<{ name: string }>();
    expect(copy?.name).toBe("Push (copy)");

    const copied = await env.DB.prepare(
      "SELECT lift_name, superset_id FROM routine_items WHERE routine_id = ? ORDER BY position"
    )
      .bind(copyId)
      .all<{ lift_name: string; superset_id: string | null }>();
    expect(copied.results.map((r) => r.lift_name)).toEqual([
      "Bench Press",
      "Overhead Press",
    ]);

    // Grouping is preserved but the superset id is regenerated, so editing the
    // copy cannot disturb the original.
    const originalSuperset = (
      await env.DB.prepare(
        "SELECT superset_id FROM routine_items WHERE routine_id = ? LIMIT 1"
      )
        .bind(id)
        .first<{ superset_id: string }>()
    )?.superset_id;
    expect(copied.results[0].superset_id).not.toBeNull();
    expect(copied.results[0].superset_id).toBe(copied.results[1].superset_id);
    expect(copied.results[0].superset_id).not.toBe(originalSuperset);
  });

  it("deleting a routine clears its schedule slot but keeps today's lifts", async () => {
    const id = await createRoutine(cookies, "Doomed");
    await addLift(cookies, id, "Squat");
    await post(`/routines/schedule/${todayWeekday()}`, cookies, { routine_id: id });
    await post("/override/routine", cookies, { routine_id: id });

    const del = await post(`/routines/${id}/delete`, cookies);
    expect(del.status).toBe(302);

    const schedule = await env.DB.prepare(
      "SELECT count(*) AS n FROM routine_schedule WHERE user_id = ?"
    )
      .bind(user.id)
      .first<{ n: number }>();
    expect(schedule?.n).toBe(0);

    // daily_overrides.routine_id is SET NULL, so the day keeps its lift list
    const override = await env.DB.prepare(
      "SELECT routine_id, items_json FROM daily_overrides WHERE user_id = ? AND date = ?"
    )
      .bind(user.id, todayIso())
      .first<{ routine_id: string | null; items_json: string }>();
    expect(override?.routine_id).toBeNull();
    expect(JSON.parse(override!.items_json)).toHaveLength(1);

    const home = await get("/", cookies);
    expect(await home.text()).toContain("Squat");
  });

  it("404s on another user's routine", async () => {
    const id = await createRoutine(cookies, "Private");

    const other = await createTestUser();
    const otherCookies = await loginAs(other.username, other.password);
    try {
      expect((await get(`/routines/${id}`, otherCookies)).status).toBe(404);
      expect((await post(`/routines/${id}/delete`, otherCookies)).status).toBe(404);
      expect((await addLift(otherCookies, id, "Sneaky")).status).toBe(404);

      // Scheduling silently ignores a routine the caller does not own
      await post("/routines/schedule/2", otherCookies, { routine_id: id });
      const n = await env.DB.prepare(
        "SELECT count(*) AS n FROM routine_schedule WHERE user_id = ?"
      )
        .bind(other.id)
        .first<{ n: number }>();
      expect(n?.n).toBe(0);
    } finally {
      await deleteTestUser(other.id);
    }
  });
});

describe("Swapping today's routine", () => {
  let user: TestUser;
  let cookies: string;
  let scheduledId: string;
  let alternateId: string;

  beforeEach(async () => {
    user = await createTestUser();
    cookies = await loginAs(user.username, user.password);

    scheduledId = await createRoutine(cookies, "Chest & Back — Barbell");
    await addLift(cookies, scheduledId, "Barbell Bench");
    await post(`/routines/schedule/${todayWeekday()}`, cookies, {
      routine_id: scheduledId,
    });

    alternateId = await createRoutine(cookies, "Chest & Back — Dumbbells");
    await addLift(cookies, alternateId, "Dumbbell Press");
  });

  afterEach(async () => {
    await deleteTestUser(user.id);
  });

  it("home shows the scheduled routine by default", async () => {
    const html = await (await get("/", cookies)).text();
    expect(html).toContain("Chest &amp; Back — Barbell");
    expect(html).toContain("Barbell Bench");
    expect(html).not.toContain("Dumbbell Press");
    // Nothing has diverged yet, so no reset affordance
    expect(html).not.toContain("/override/reset");
  });

  it("swapping replaces today's lifts without touching the schedule", async () => {
    const res = await post("/override/routine", cookies, { routine_id: alternateId });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Dumbbell Press");
    expect(html).not.toContain("Barbell Bench");
    expect(html).toContain("Instead of Chest &amp; Back — Barbell");

    // The weekly schedule is unchanged
    const row = await env.DB.prepare(
      "SELECT routine_id FROM routine_schedule WHERE user_id = ? AND weekday = ?"
    )
      .bind(user.id, todayWeekday())
      .first<{ routine_id: string }>();
    expect(row?.routine_id).toBe(scheduledId);

    // Today's override records which routine it was built from
    const override = await env.DB.prepare(
      "SELECT routine_id FROM daily_overrides WHERE user_id = ? AND date = ?"
    )
      .bind(user.id, todayIso())
      .first<{ routine_id: string }>();
    expect(override?.routine_id).toBe(alternateId);
  });

  it("swapping twice replaces rather than accumulates", async () => {
    await post("/override/routine", cookies, { routine_id: alternateId });
    const res = await post("/override/routine", cookies, { routine_id: scheduledId });
    const html = await res.text();
    expect(html).toContain("Barbell Bench");
    expect(html).not.toContain("Dumbbell Press");

    const rows = await env.DB.prepare(
      "SELECT count(*) AS n FROM daily_overrides WHERE user_id = ? AND date = ?"
    )
      .bind(user.id, todayIso())
      .first<{ n: number }>();
    expect(rows?.n).toBe(1);
  });

  it("reset discards the swap and returns to the schedule", async () => {
    await post("/override/routine", cookies, { routine_id: alternateId });

    const res = await post("/override/reset", cookies);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Barbell Bench");
    expect(html).not.toContain("Dumbbell Press");

    const override = await env.DB.prepare(
      "SELECT count(*) AS n FROM daily_overrides WHERE user_id = ? AND date = ?"
    )
      .bind(user.id, todayIso())
      .first<{ n: number }>();
    expect(override?.n).toBe(0);
  });

  it("ignores a swap to a routine the user does not own", async () => {
    const other = await createTestUser();
    const otherCookies = await loginAs(other.username, other.password);
    const foreignId = await createRoutine(otherCookies, "Not Yours");
    await addLift(otherCookies, foreignId, "Forbidden Curl");

    try {
      const res = await post("/override/routine", cookies, { routine_id: foreignId });
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).not.toContain("Forbidden Curl");
      expect(html).toContain("Barbell Bench");
    } finally {
      await deleteTestUser(other.id);
    }
  });

  it("removing a lift works on the first click of an unmodified day", async () => {
    // The item ids rendered before an override exists must survive the lazy
    // snapshot taken on first mutation, or the first edit silently does nothing.
    const itemId = (
      await env.DB.prepare("SELECT id FROM routine_items WHERE routine_id = ?")
        .bind(scheduledId)
        .first<{ id: string }>()
    )!.id;

    const res = await post(`/override/items/${itemId}/delete`, cookies);
    expect(res.status).toBe(200);
    expect(await res.text()).not.toContain("Barbell Bench");
  });

  it("edits a lift for today without touching the routine", async () => {
    const itemId = (
      await env.DB.prepare("SELECT id FROM routine_items WHERE routine_id = ?")
        .bind(scheduledId)
        .first<{ id: string }>()
    )!.id;

    const res = await post(`/override/items/${itemId}`, cookies, {
      lift_name: "Incline Bench",
      reps_min: "5",
      reps_max: "8",
      sets: "4",
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Incline Bench");
    expect(html).toContain("5–8 reps");
    expect(html).not.toContain("Barbell Bench");

    // The routine itself is unchanged — this was a today-only edit
    const item = await env.DB.prepare(
      "SELECT lift_name, reps_min, reps_max, sets FROM routine_items WHERE id = ?"
    )
      .bind(itemId)
      .first<{ lift_name: string; reps_min: number; reps_max: number; sets: number }>();
    expect(item).toMatchObject({
      lift_name: "Barbell Bench",
      reps_min: 8,
      reps_max: 12,
      sets: 3,
    });

    // ...and the edit landed in today's override, keeping the item's id
    const override = await env.DB.prepare(
      "SELECT items_json FROM daily_overrides WHERE user_id = ? AND date = ?"
    )
      .bind(user.id, todayIso())
      .first<{ items_json: string }>();
    expect(JSON.parse(override!.items_json)).toMatchObject([
      { id: itemId, lift_name: "Incline Bench", reps_min: 5, reps_max: 8, sets: 4 },
    ]);
  });

  it("ignores an edit with a blank name or unparseable numbers", async () => {
    const itemId = (
      await env.DB.prepare("SELECT id FROM routine_items WHERE routine_id = ?")
        .bind(scheduledId)
        .first<{ id: string }>()
    )!.id;

    const res = await post(`/override/items/${itemId}`, cookies, {
      lift_name: "   ",
      reps_min: "abc",
      reps_max: "8",
      sets: "4",
    });
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("Barbell Bench");
  });

  it("edits a lift inside a superset", async () => {
    await addLift(cookies, scheduledId, "Barbell Row");
    const ids = (
      await env.DB.prepare(
        "SELECT id FROM routine_items WHERE routine_id = ? ORDER BY position"
      )
        .bind(scheduledId)
        .all<{ id: string }>()
    ).results.map((r) => r.id);

    const grouped = await postMulti(
      "/override/superset",
      cookies,
      ids.map((id) => ["item_ids[]", id] as [string, string])
    );
    expect(grouped.status).toBe(200);

    const res = await post(`/override/items/${ids[1]}`, cookies, {
      lift_name: "Pendlay Row",
      reps_min: "6",
      reps_max: "6",
      sets: "5",
    });
    const html = await res.text();
    expect(html).toContain("Pendlay Row");
    expect(html).not.toContain("Barbell Row");

    // Still grouped with its superset partner
    const items = JSON.parse(
      (
        await env.DB.prepare(
          "SELECT items_json FROM daily_overrides WHERE user_id = ? AND date = ?"
        )
          .bind(user.id, todayIso())
          .first<{ items_json: string }>()
      )!.items_json
    ) as { id: string; lift_name: string; superset_id: string | null }[];
    const edited = items.find((i) => i.id === ids[1])!;
    expect(edited.lift_name).toBe("Pendlay Row");
    expect(edited.superset_id).not.toBeNull();
    expect(edited.superset_id).toBe(items.find((i) => i.id === ids[0])!.superset_id);
  });

  it("swapping into a rest day says so", async () => {
    await post(`/routines/schedule/${todayWeekday()}`, cookies, { routine_id: "" });

    const res = await post("/override/routine", cookies, { routine_id: alternateId });
    const html = await res.text();
    expect(html).toContain("Dumbbell Press");
    expect(html).toContain("is normally a rest day");
  });
});
