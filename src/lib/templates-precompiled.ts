// AUTO-GENERATED — do not edit manually.
// Run `npm run precompile` to regenerate from src/templates/.
// @ts-nocheck
/* eslint-disable */

export const precompiledTemplates: Record<string, { root: unknown }> = {
  "base.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <!-- Apply dark class before CSS loads to prevent flash of unstyled content -->\n  <script>(function(){var m=document.cookie.match(/(?:^|;\\s*)dark_mode=1(?:;|$)/);if(m)document.documentElement.classList.add('dark');}());</script>\n  ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/head.njk", false, "base.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
callback(null,t_1);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n</head>\n<body class=\"bg-white text-gray-900 min-h-screen flex flex-col\">\n\n  ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/nav.njk", false, "base.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_8,t_7) {
if(t_8) { cb(t_8); return; }
callback(null,t_7);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n  ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/header.njk", false, "base.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
callback(null,t_9);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_12,t_11) {
if(t_12) { cb(t_12); return; }
callback(null,t_11);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n\n  <main class=\"flex-1 max-w-5xl mx-auto w-full px-4 py-8 ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "user")?"pb-24":""), env.opts.autoescape);
output += "\">\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
output += t_13;
output += "\n  </main>\n\n  ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/footer.njk", false, "base.njk", false, function(t_16,t_15) {
if(t_16) { cb(t_16); return; }
callback(null,t_15);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_18,t_17) {
if(t_18) { cb(t_18); return; }
callback(null,t_17);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n  ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/bottom-nav.njk", false, "base.njk", false, function(t_20,t_19) {
if(t_20) { cb(t_20); return; }
callback(null,t_19);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_22,t_21) {
if(t_22) { cb(t_22); return; }
callback(null,t_21);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n\n  <!-- HTMX — https://htmx.org -->\n  <script src=\"https://unpkg.com/htmx.org@2.0.4\" integrity=\"sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+\" crossorigin=\"anonymous\"></script>\n  <script>\n    // Swap 4xx error responses so form validation errors are displayed\n    htmx.config.responseHandling = [\n      {code:\"204\", swap: false},\n      {code:\"[23]..\", swap: true},\n      {code:\"4..\", swap: true},\n      {code:\"5..\", swap: false, error: true},\n      {code:\".*\", swap: false}\n    ];\n  </script>\n  <script>\n    if ('serviceWorker' in navigator) {\n      navigator.serviceWorker.register('/sw.js');\n    }\n  </script>\n</body>\n</html>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 13;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/about.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/about.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-2xl mx-auto space-y-12\">\n\n  <div>\n    <h1 class=\"text-2xl font-bold text-gray-900 mb-2\">About Lift Log</h1>\n    <p class=\"text-gray-600\">Lift Log is a personal strength training tracker. Set up your weekly routines, log sets as you work out, and track your best and most recent performance for every lift.</p>\n  </div>\n\n  ";
output += "\n  <section class=\"space-y-6\">\n    <h2 class=\"text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2\">How it works</h2>\n\n    <div class=\"space-y-2\">\n      <h3 class=\"font-medium text-gray-900\">Routines</h3>\n      <p class=\"text-sm text-gray-600\">A routine is a list of lifts assigned to a specific day of the week. Go to <a href=\"/routines\" class=\"text-indigo-600 hover:underline\">Routines</a> to configure one for each training day. For each lift, you set a name (free text), a rep range (e.g. 8–12), and a set count.</p>\n      <p class=\"text-sm text-gray-600\">Lifts can be grouped into <strong>supersets</strong>: select two or more lifts and tap \"Make superset.\" Supersets are displayed together as a group and move as a unit when reordering.</p>\n    </div>\n\n    <div class=\"space-y-2\">\n      <h3 class=\"font-medium text-gray-900\">Today's workout (Home)</h3>\n      <p class=\"text-sm text-gray-600\">The <a href=\"/\" class=\"text-indigo-600 hover:underline\">Home</a> page loads your routine for today's day of the week. For each lift it shows your <strong>most recent</strong> performance (date + sets) and your <strong>best</strong> performance (the session with the highest single-set volume).</p>\n      <p class=\"text-sm text-gray-600\">You can reorder, add, or remove lifts for today without changing your base routine — those changes are saved as a daily override and only affect the current day.</p>\n      <p class=\"text-sm text-gray-600\">When you're done, tap <strong>Complete Workout</strong> to mark the day done. If inline logging is enabled, your entered sets are saved as a workout record at the same time.</p>\n    </div>\n\n    <div class=\"space-y-2\">\n      <h3 class=\"font-medium text-gray-900\">Logging a workout</h3>\n      <p class=\"text-sm text-gray-600\">There are two ways to log sets:</p>\n      <ul class=\"text-sm text-gray-600 list-disc list-inside space-y-1 ml-1\">\n        <li><strong>Inline logging</strong> (enable in Settings) — set input rows appear directly on the Home page for each lift. Fill them in and tap Complete Workout to save.</li>\n        <li><strong>Log page</strong> — <a href=\"/workouts/new\" class=\"text-indigo-600 hover:underline\">Log a workout</a> independently of your routine. Add any lifts and sets, pick the date, and submit.</li>\n      </ul>\n      <p class=\"text-sm text-gray-600\">All logged workouts update the lift stats cache, so your \"Last\" and \"Best\" numbers on the Home page stay current.</p>\n    </div>\n\n    <div id=\"settings\" class=\"space-y-2\">\n      <h3 class=\"font-medium text-gray-900\">Settings</h3>\n      <ul class=\"text-sm text-gray-600 space-y-3\">\n        <li>\n          <strong>Inline logging</strong> — Toggle whether set input rows appear on the Home page. When off, the Home page is read-only (useful if you prefer to log separately after your workout).\n        </li>\n        <li>\n          <strong>Webhook URL</strong> — Enter a URL and it will receive a POST request with your workout data as JSON every time you complete a workout. Useful for forwarding data to other services. Delivery is best-effort with no retries.\n        </li>\n        <li>\n          <strong>API keys</strong> — Create named API keys to submit or retrieve workout data from external tools (e.g. a phone shortcut, a Garmin sync script). Keys are shown once at creation — store them securely. You can revoke a key at any time.\n        </li>\n      </ul>\n    </div>\n\n    <div class=\"space-y-2\">\n      <h3 class=\"font-medium text-gray-900\">Public API</h3>\n      <p class=\"text-sm text-gray-600\">Workouts can be read and written via a JSON API at <code class=\"bg-gray-100 px-1 rounded text-xs\">/api/workouts</code>. Authenticate with your session cookie or an <code class=\"bg-gray-100 px-1 rounded text-xs\">Authorization: ApiKey &lt;key&gt;</code> header. Full CRUD is supported: list, get, create, replace, and delete.</p>\n    </div>\n  </section>\n\n  ";
output += "\n  <section id=\"disclaimers\" class=\"space-y-4\">\n    <h2 class=\"text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2\">Disclaimers</h2>\n\n    <div class=\"bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3 text-sm text-amber-900\">\n\n      <p><strong>No password recovery.</strong> We have no way to recover or reset your password. If you forget it, your account and all data associated with it are permanently inaccessible. There is no \"forgot password\" flow.</p>\n\n      <p><strong>No guarantees on data.</strong> Lift Log is a personal project provided as-is. We make no guarantees about uptime, data durability, or continued availability. We are not responsible for any loss of data, and we accept no liability for any consequences of using this service.</p>\n\n      <p><strong>Do not reuse passwords.</strong> Use a unique password for this account. We store passwords securely (PBKDF2-SHA256), but no service is completely immune to breaches. A unique password ensures that any compromise here does not affect your other accounts. Use a password manager.</p>\n\n    </div>\n  </section>\n\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/index.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/index.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-lg mx-auto\">\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "routine") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "routine")),"name")) {
output += "\n    <p class=\"text-sm text-gray-500 -mt-4 mb-5\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "routine")),"name"), env.opts.autoescape);
output += "</p>\n  ";
;
}
else {
if(!runtime.contextOrFrameLookup(context, frame, "routine")) {
output += "\n    <div class=\"mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800\">\n      No routine for ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "dayName"), env.opts.autoescape);
output += ".\n      <a href=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "weekday"), env.opts.autoescape);
output += "\" class=\"font-medium underline\">Set one up →</a>\n    </div>\n  ";
;
}
;
}
output += "\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "completed")) {
output += "\n    <div class=\"mb-5 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-medium\">\n      ✓ Workout complete for today!\n    </div>\n  ";
;
}
output += "\n\n  ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/home/lifts-panel.njk", false, "pages/index.njk", false, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
callback(null,t_6);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
callback(null,t_8);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n\n</div>\n";
cb(null, output);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/login.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/login.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-md mx-auto mt-8\">\n  <h2 class=\"text-xl font-semibold mb-6\">Log in to your account</h2>\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "error")) {
output += "\n    <div class=\"mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm\">\n      ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "error"), env.opts.autoescape);
output += "\n    </div>\n  ";
;
}
output += "\n\n  <!--\n    Works as a standard HTML form POST (no JS required).\n    When htmx is available, hx-post intercepts submission for a smoother UX.\n  -->\n  <form\n    method=\"POST\"\n    action=\"/auth/login\"\n    hx-post=\"/auth/login\"\n    hx-target=\"body\"\n    hx-push-url=\"true\"\n    class=\"space-y-4\"\n  >\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\" />\n\n    <div>\n      <label for=\"username\" class=\"block text-sm font-medium text-gray-700 mb-1\">\n        Username\n      </label>\n      <input\n        id=\"username\"\n        name=\"username\"\n        type=\"text\"\n        required\n        autocomplete=\"username\"\n        class=\"w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\"\n      />\n    </div>\n\n    <div>\n      <label for=\"password\" class=\"block text-sm font-medium text-gray-700 mb-1\">\n        Password\n      </label>\n      <input\n        id=\"password\"\n        name=\"password\"\n        type=\"password\"\n        required\n        autocomplete=\"current-password\"\n        class=\"w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\"\n      />\n    </div>\n\n    <!-- Cloudflare Turnstile widget -->\n    <div\n      class=\"cf-turnstile\"\n      data-sitekey=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "turnstileSiteKey"), env.opts.autoescape);
output += "\"\n      data-callback=\"onTurnstileSuccess\"\n    ></div>\n    <input type=\"hidden\" name=\"turnstileToken\" id=\"turnstileToken\" />\n\n    <button\n      type=\"submit\"\n      class=\"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors\"\n    >\n      Log in\n    </button>\n  </form>\n\n  <p class=\"mt-4 text-sm text-gray-600 text-center\">\n    Don't have an account?\n    <a href=\"/auth/signup\" class=\"text-indigo-600 hover:underline\">Sign up</a>\n  </p>\n</div>\n\n<script src=\"https://challenges.cloudflare.com/turnstile/v0/api.js\" async defer></script>\n<script>\n  function onTurnstileSuccess(token) {\n    document.getElementById('turnstileToken').value = token;\n  }\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/notes/detail.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/notes/detail.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-2xl mx-auto\">\n  <div class=\"flex items-center justify-between mb-4\">\n    <h2 class=\"text-xl font-semibold truncate\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"title"), env.opts.autoescape);
output += "</h2>\n    <div class=\"flex items-center gap-3 flex-shrink-0 ml-4\">\n      <a\n        href=\"/notes/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"id"), env.opts.autoescape);
output += "/edit\"\n        class=\"text-sm text-indigo-600 hover:underline\"\n      >Edit</a>\n      <form\n        method=\"POST\"\n        action=\"/notes/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"id"), env.opts.autoescape);
output += "/delete\"\n        hx-post=\"/notes/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"id"), env.opts.autoescape);
output += "/delete\"\n        hx-push-url=\"/notes\"\n        hx-confirm=\"Delete this note?\"\n      >\n        <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\" />\n        <button type=\"submit\" class=\"text-sm text-red-500 hover:text-red-700 transition-colors\">\n          Delete\n        </button>\n      </form>\n    </div>\n  </div>\n\n  <div class=\"text-xs text-gray-400 mb-6\">\n    Created ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"created_at"), env.opts.autoescape);
output += "\n    ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"updated_at") !== runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"created_at")) {
output += " · Updated ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"updated_at"), env.opts.autoescape);
;
}
output += "\n  </div>\n\n  <div class=\"prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"body"), env.opts.autoescape);
output += "</div>\n\n  <div class=\"mt-8\">\n    <a href=\"/notes\" class=\"text-sm text-gray-500 hover:text-gray-700\">&larr; All notes</a>\n  </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/notes/form.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/notes/form.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-2xl mx-auto\">\n  <h2 class=\"text-xl font-semibold mb-6\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "title"), env.opts.autoescape);
output += "</h2>\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "error")) {
output += "\n    <div class=\"mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm\">\n      ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "error"), env.opts.autoescape);
output += "\n    </div>\n  ";
;
}
output += "\n\n  <!--\n    Works as a standard HTML form POST (no JS required).\n    When HTMX is available, hx-post intercepts submission for a smoother UX.\n  -->\n  <form\n    method=\"POST\"\n    action=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "action"), env.opts.autoescape);
output += "\"\n    hx-post=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "action"), env.opts.autoescape);
output += "\"\n    hx-target=\"body\"\n    hx-push-url=\"true\"\n    class=\"space-y-4\"\n  >\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\" />\n\n    <div>\n      <label for=\"title\" class=\"block text-sm font-medium text-gray-700 mb-1\">\n        Title <span class=\"text-red-500\">*</span>\n      </label>\n      <input\n        id=\"title\"\n        name=\"title\"\n        type=\"text\"\n        required\n        maxlength=\"200\"\n        value=\"";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "note")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"title"):""), env.opts.autoescape);
output += "\"\n        class=\"w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\"\n        placeholder=\"Note title\"\n      />\n    </div>\n\n    <div>\n      <label for=\"body\" class=\"block text-sm font-medium text-gray-700 mb-1\">\n        Body\n      </label>\n      <textarea\n        id=\"body\"\n        name=\"body\"\n        rows=\"10\"\n        maxlength=\"10000\"\n        class=\"w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono\"\n        placeholder=\"Write your note here...\"\n      >";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "note")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"body"):""), env.opts.autoescape);
output += "</textarea>\n    </div>\n\n    <div class=\"flex items-center gap-3\">\n      <button\n        type=\"submit\"\n        class=\"bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors\"\n      >\n        ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "note")?"Save changes":"Create note"), env.opts.autoescape);
output += "\n      </button>\n      <a\n        href=\"";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "note")?"/notes/" + runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "note")),"id"):"/notes"), env.opts.autoescape);
output += "\"\n        class=\"text-sm text-gray-500 hover:text-gray-700\"\n      >\n        Cancel\n      </a>\n    </div>\n  </form>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/notes/list.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/notes/list.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-2xl mx-auto\">\n  <div class=\"flex items-center justify-between mb-6\">\n    <h2 class=\"text-xl font-semibold\">My Notes</h2>\n    <a\n      href=\"/notes/new\"\n      class=\"bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors\"\n    >\n      + New Note\n    </a>\n  </div>\n\n  ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "notes")),"length") === 0) {
output += "\n    <p class=\"text-gray-500 text-sm\">No notes yet. <a href=\"/notes/new\" class=\"text-indigo-600 hover:underline\">Create your first note.</a></p>\n  ";
;
}
else {
output += "\n    <ul class=\"divide-y divide-gray-200 border border-gray-200 rounded\" id=\"notes-list\">\n      ";
frame = frame.push();
var t_8 = runtime.contextOrFrameLookup(context, frame, "notes");
if(t_8) {t_8 = runtime.fromIterator(t_8);
var t_7 = t_8.length;
for(var t_6=0; t_6 < t_8.length; t_6++) {
var t_9 = t_8[t_6];
frame.set("note", t_9);
frame.set("loop.index", t_6 + 1);
frame.set("loop.index0", t_6);
frame.set("loop.revindex", t_7 - t_6);
frame.set("loop.revindex0", t_7 - t_6 - 1);
frame.set("loop.first", t_6 === 0);
frame.set("loop.last", t_6 === t_7 - 1);
frame.set("loop.length", t_7);
output += "\n        <li class=\"flex items-center justify-between px-4 py-3 hover:bg-gray-50\">\n          <a href=\"/notes/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"id"), env.opts.autoescape);
output += "\" class=\"text-sm font-medium text-gray-900 hover:text-indigo-600 truncate flex-1\">\n            ";
output += runtime.suppressValue(runtime.memberLookup((t_9),"title"), env.opts.autoescape);
output += "\n          </a>\n          <form\n            method=\"POST\"\n            action=\"/notes/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"id"), env.opts.autoescape);
output += "/delete\"\n            class=\"ml-4 flex-shrink-0\"\n            hx-post=\"/notes/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"id"), env.opts.autoescape);
output += "/delete\"\n            hx-target=\"#notes-list\"\n            hx-swap=\"outerHTML\"\n            hx-confirm=\"Delete this note?\"\n          >\n            <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\" />\n            <button\n              type=\"submit\"\n              class=\"text-xs text-red-500 hover:text-red-700 transition-colors\"\n            >\n              Delete\n            </button>\n          </form>\n        </li>\n      ";
;
}
}
frame = frame.pop();
output += "\n    </ul>\n  ";
;
}
output += "\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/routines/day.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/routines/day.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-lg mx-auto\">\n\n  <div class=\"mb-6\">\n    <a href=\"/routines\" class=\"text-sm text-gray-500 hover:text-gray-700\">&larr; All routines</a>\n  </div>\n\n  <!-- Routine name -->\n  <div class=\"mb-6\">\n    <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/name\" class=\"flex gap-2 items-center\">\n      <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n      <input type=\"text\" name=\"name\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "routine")),"name"), env.opts.autoescape);
output += "\"\n             placeholder=\"Routine name (e.g. Push Day)\"\n             maxlength=\"100\"\n             class=\"flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n      <button type=\"submit\"\n              class=\"bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded transition-colors\">\n        Save\n      </button>\n    </form>\n  </div>\n\n  <!-- Items list (htmx target) -->\n  ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/routines/items-list.njk", false, "pages/routines/day.njk", false, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
callback(null,t_6);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
callback(null,t_8);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n\n</div>\n";
cb(null, output);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/routines/list.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/routines/list.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-lg mx-auto\">\n  <div class=\"flex items-center justify-between mb-6\">\n    <h2 class=\"text-xl font-semibold\">Weekly Routines</h2>\n  </div>\n\n  <ul class=\"divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden\">\n    ";
frame = frame.push();
var t_8 = runtime.contextOrFrameLookup(context, frame, "days");
if(t_8) {t_8 = runtime.fromIterator(t_8);
var t_7 = t_8.length;
for(var t_6=0; t_6 < t_8.length; t_6++) {
var t_9 = t_8[t_6];
frame.set("day", t_9);
frame.set("loop.index", t_6 + 1);
frame.set("loop.index0", t_6);
frame.set("loop.revindex", t_7 - t_6);
frame.set("loop.revindex0", t_7 - t_6 - 1);
frame.set("loop.first", t_6 === 0);
frame.set("loop.last", t_6 === t_7 - 1);
frame.set("loop.length", t_7);
output += "\n      <li>\n        <a href=\"/routines/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"weekday"), env.opts.autoescape);
output += "\"\n           class=\"flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors\">\n          <span class=\"font-medium text-gray-900\">";
output += runtime.suppressValue(runtime.memberLookup((t_9),"name"), env.opts.autoescape);
output += "</span>\n          <div class=\"flex items-center gap-2\">\n            ";
if(runtime.memberLookup((t_9),"routine") && runtime.memberLookup((runtime.memberLookup((t_9),"routine")),"name")) {
output += "\n              <span class=\"text-sm text-gray-600\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_9),"routine")),"name"), env.opts.autoescape);
output += "</span>\n            ";
;
}
else {
if(runtime.memberLookup((t_9),"routine")) {
output += "\n              <span class=\"text-sm text-gray-400 italic\">Unnamed</span>\n            ";
;
}
else {
output += "\n              <span class=\"text-sm text-gray-400\">No routine</span>\n            ";
;
}
;
}
output += "\n            <svg class=\"w-4 h-4 text-gray-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n              <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5l7 7-7 7\"/>\n            </svg>\n          </div>\n        </a>\n      </li>\n    ";
;
}
}
frame = frame.pop();
output += "\n  </ul>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/settings.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/settings.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-lg mx-auto space-y-8\">\n\n  <p class=\"text-sm text-gray-500\"><a href=\"/about#settings\" class=\"text-indigo-600 hover:underline\">What do these settings do?</a></p>\n\n  <!-- Appearance -->\n  <section>\n    <h2 class=\"text-base font-semibold text-gray-900 mb-3\">Appearance</h2>\n    <div class=\"border border-gray-200 rounded-lg p-4\">\n      ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/settings/dark-mode-toggle.njk", false, "pages/settings.njk", false, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
callback(null,t_6);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
callback(null,t_8);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n    </div>\n  </section>\n\n  <!-- Inline Logging -->\n  <section>\n    <h2 class=\"text-base font-semibold text-gray-900 mb-3\">Workout Logging</h2>\n    <div class=\"border border-gray-200 rounded-lg p-4\">\n      ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/settings/logging-toggle.njk", false, "pages/settings.njk", false, function(t_11,t_10) {
if(t_11) { cb(t_11); return; }
callback(null,t_10);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_13,t_12) {
if(t_13) { cb(t_13); return; }
callback(null,t_12);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n    </div>\n  </section>\n\n  <!-- Webhook -->\n  <section>\n    <h2 class=\"text-base font-semibold text-gray-900 mb-1\">Webhook</h2>\n    <p class=\"text-sm text-gray-500 mb-3\">\n      After completing a workout, we'll POST the workout JSON to this URL.\n    </p>\n    <div class=\"border border-gray-200 rounded-lg p-4\">\n      <form method=\"POST\" action=\"/settings/webhook\">\n        <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n        <div class=\"flex gap-2\">\n          <input type=\"url\" name=\"webhook_url\"\n                 value=\"";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "userSettings")),"webhook_url")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "userSettings")),"webhook_url"):""), env.opts.autoescape);
output += "\"\n                 placeholder=\"https://your-endpoint.com/hook\"\n                 class=\"flex-1 min-w-0 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n          <button type=\"submit\"\n                  class=\"bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded transition-colors flex-shrink-0\">\n            Save\n          </button>\n        </div>\n        ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "userSettings")),"webhook_url")) {
output += "\n          <p class=\"text-xs text-green-600 mt-2\">Webhook active.</p>\n        ";
;
}
output += "\n      </form>\n    </div>\n  </section>\n\n  <!-- Data -->\n  <section>\n    <h2 class=\"text-base font-semibold text-gray-900 mb-1\">Data</h2>\n    <p class=\"text-sm text-gray-500 mb-3\">\n      Recalculate personal bests from your full workout history.\n    </p>\n    <div class=\"border border-gray-200 rounded-lg p-4\">\n      <div id=\"recalc-stats\">\n        <form hx-post=\"/settings/recalculate-stats\"\n              hx-target=\"#recalc-stats\"\n              hx-swap=\"outerHTML\"\n              hx-indicator=\"#recalc-indicator\">\n          <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n          <button type=\"submit\"\n                  class=\"bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded transition-colors\"\n                  hx-disabled-elt=\"this\">\n            Recalculate lift stats\n          </button>\n          <span id=\"recalc-indicator\" class=\"htmx-indicator text-sm text-gray-500 ml-2\">Recalculating…</span>\n        </form>\n      </div>\n    </div>\n  </section>\n\n  <!-- API Keys -->\n  <section>\n    <h2 class=\"text-base font-semibold text-gray-900 mb-1\">API Keys</h2>\n    <p class=\"text-sm text-gray-500 mb-3\">\n      Use an API key to submit workouts from external devices or scripts.<br>\n      <code class=\"bg-gray-100 px-1 rounded text-xs\">Authorization: ApiKey &lt;key&gt;</code>\n    </p>\n    ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/settings/api-keys.njk", false, "pages/settings.njk", false, function(t_15,t_14) {
if(t_15) { cb(t_15); return; }
callback(null,t_14);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_17,t_16) {
if(t_17) { cb(t_17); return; }
callback(null,t_16);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n  </section>\n\n</div>\n";
cb(null, output);
})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/signup.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/signup.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-md mx-auto mt-8\">\n  <h2 class=\"text-xl font-semibold mb-6\">Create an account</h2>\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "error")) {
output += "\n    <div class=\"mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm\">\n      ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "error"), env.opts.autoescape);
output += "\n    </div>\n  ";
;
}
output += "\n\n  <!--\n    Works as a standard HTML form POST (no JS required).\n    When htmx is available, hx-post intercepts submission for a smoother UX.\n  -->\n  <form\n    method=\"POST\"\n    action=\"/auth/signup\"\n    hx-post=\"/auth/signup\"\n    hx-target=\"body\"\n    hx-push-url=\"true\"\n    class=\"space-y-4\"\n  >\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\" />\n\n    <div>\n      <label for=\"username\" class=\"block text-sm font-medium text-gray-700 mb-1\">\n        Username\n      </label>\n      <input\n        id=\"username\"\n        name=\"username\"\n        type=\"text\"\n        required\n        minlength=\"3\"\n        maxlength=\"254\"\n        pattern=\"[a-zA-Z0-9_.@+\\-]+\"\n        autocomplete=\"username\"\n        class=\"w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\"\n        placeholder=\"you@example.com\"\n      />\n    </div>\n\n    <div>\n      <label for=\"password\" class=\"block text-sm font-medium text-gray-700 mb-1\">\n        Password\n      </label>\n      <input\n        id=\"password\"\n        name=\"password\"\n        type=\"password\"\n        required\n        minlength=\"8\"\n        maxlength=\"128\"\n        autocomplete=\"new-password\"\n        class=\"w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\"\n        placeholder=\"At least 8 characters\"\n      />\n    </div>\n\n    <!-- Cloudflare Turnstile widget -->\n    <div\n      class=\"cf-turnstile\"\n      data-sitekey=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "turnstileSiteKey"), env.opts.autoescape);
output += "\"\n      data-callback=\"onTurnstileSuccess\"\n    ></div>\n    <input type=\"hidden\" name=\"turnstileToken\" id=\"turnstileToken\" />\n\n    <button\n      type=\"submit\"\n      class=\"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors\"\n    >\n      Sign up\n    </button>\n  </form>\n\n  <p class=\"mt-4 text-sm text-gray-600 text-center\">\n    Already have an account?\n    <a href=\"/auth/login\" class=\"text-indigo-600 hover:underline\">Log in</a>\n  </p>\n\n  <p class=\"mt-4 text-xs text-gray-500 text-center leading-relaxed\">\n    Use a <strong>unique password</strong> you don't use elsewhere — there is no password recovery,\n    and forgotten passwords cannot be retrieved.\n    <a href=\"/about#disclaimers\" class=\"text-indigo-500 hover:underline\">Full disclaimers &rarr;</a>\n  </p>\n</div>\n\n<script src=\"https://challenges.cloudflare.com/turnstile/v0/api.js\" async defer></script>\n<script>\n  function onTurnstileSuccess(token) {\n    document.getElementById('turnstileToken').value = token;\n  }\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/workouts/edit.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/workouts/edit.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-lg mx-auto\">\n\n  <div class=\"mb-6\">\n    <a href=\"/workouts\" class=\"text-sm text-gray-500 hover:text-gray-700\">&larr; History</a>\n  </div>\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "error")) {
output += "\n    <div class=\"mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm\">\n      ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "error"), env.opts.autoescape);
output += "\n    </div>\n  ";
;
}
output += "\n\n  <form id=\"workout-form\" method=\"POST\" action=\"/workouts/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "workout")),"id"), env.opts.autoescape);
output += "/edit\" class=\"space-y-6\">\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n\n    <!-- Date + Notes -->\n    <div class=\"space-y-3\">\n      <div>\n        <label for=\"date\" class=\"block text-sm font-medium text-gray-700 mb-1\">Date</label>\n        <input type=\"date\" id=\"date\" name=\"date\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "workout")),"date"), env.opts.autoescape);
output += "\" required\n               class=\"border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n      </div>\n      <div>\n        <label for=\"notes\" class=\"block text-sm font-medium text-gray-700 mb-1\">Notes <span class=\"text-gray-400 font-normal\">(optional)</span></label>\n        <textarea id=\"notes\" name=\"notes\" rows=\"2\" maxlength=\"2000\"\n                  placeholder=\"How'd it go?\"\n                  class=\"w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none\">";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "workout")),"notes")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "workout")),"notes"):""), env.opts.autoescape);
output += "</textarea>\n      </div>\n    </div>\n\n    <!-- Lifts -->\n    <div>\n      <h3 class=\"text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide\">Lifts</h3>\n      <div id=\"lifts-container\" class=\"space-y-4\"></div>\n      <button type=\"button\" id=\"add-lift-btn\"\n              class=\"mt-3 w-full border border-dashed border-gray-300 hover:border-indigo-400 text-gray-500 hover:text-indigo-600 rounded-lg py-3 text-sm font-medium transition-colors\">\n        + Add Lift\n      </button>\n    </div>\n\n    <button type=\"submit\"\n            class=\"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors\">\n      Save Changes\n    </button>\n  </form>\n</div>\n\n<!-- Templates (not rendered, cloned by JS) -->\n<template id=\"lift-template\">\n  <div class=\"lift-section border border-gray-200 rounded-lg overflow-hidden\" data-lift-idx=\"\">\n    <div class=\"bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2\">\n      <input type=\"text\" name=\"lift_name[]\" placeholder=\"Lift name (e.g. Squat)\" required\n             maxlength=\"100\"\n             class=\"flex-1 bg-transparent text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none min-w-0\">\n      <input type=\"hidden\" name=\"lift_superset[]\" value=\"\">\n      <button type=\"button\" class=\"remove-lift-btn text-gray-400 hover:text-red-500 text-lg leading-none flex-shrink-0\" title=\"Remove lift\">&times;</button>\n    </div>\n    <div class=\"p-3 space-y-2\">\n      <div class=\"sets-container space-y-2\"></div>\n      <button type=\"button\" class=\"add-set-btn text-xs text-indigo-600 hover:text-indigo-800 font-medium\">\n        + Add set\n      </button>\n    </div>\n  </div>\n</template>\n\n<template id=\"set-template\">\n  <div class=\"set-row flex items-center gap-2\">\n    <input type=\"hidden\" name=\"set_lift[]\" value=\"\">\n    <span class=\"set-label text-xs text-gray-400 w-6 flex-shrink-0 text-center font-medium\"></span>\n    <div class=\"flex items-center gap-1 flex-1\">\n      <input type=\"number\" name=\"set_reps[]\" placeholder=\"Reps\" required\n             min=\"0\" max=\"9999\"\n             class=\"w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n      <span class=\"text-gray-400 text-xs flex-shrink-0\">×</span>\n      <input type=\"number\" name=\"set_weight[]\" placeholder=\"lbs\" required\n             min=\"0\" max=\"9999\" step=\"0.5\"\n             class=\"w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n      <span class=\"text-gray-400 text-xs flex-shrink-0\">lbs</span>\n    </div>\n    <button type=\"button\" class=\"remove-set-btn text-gray-300 hover:text-red-500 flex-shrink-0 leading-none\"\n            title=\"Remove set\">&times;</button>\n  </div>\n</template>\n\n<script>\n  let liftCount = 0;\n\n  function addSet(liftSection, reps, weight) {\n    const liftIdx = parseInt(liftSection.dataset.liftIdx);\n    const container = liftSection.querySelector('.sets-container');\n    const setIdx = container.querySelectorAll('.set-row').length;\n\n    const tmpl = document.getElementById('set-template').content.cloneNode(true);\n    const row = tmpl.querySelector('.set-row');\n\n    row.querySelector('[name=\"set_lift[]\"]').value = liftIdx;\n    row.querySelector('.set-label').textContent = setIdx + 1;\n\n    if (reps !== undefined) row.querySelector('[name=\"set_reps[]\"]').value = reps;\n    if (weight !== undefined) row.querySelector('[name=\"set_weight[]\"]').value = weight;\n\n    row.querySelector('.remove-set-btn').addEventListener('click', () => {\n      if (container.querySelectorAll('.set-row').length > 1) {\n        row.remove();\n        renumberSets(container);\n      }\n    });\n\n    container.appendChild(tmpl);\n  }\n\n  function renumberSets(container) {\n    container.querySelectorAll('.set-label').forEach((el, i) => {\n      el.textContent = i + 1;\n    });\n  }\n\n  function addLift(liftName, supersetId, sets) {\n    const tmpl = document.getElementById('lift-template').content.cloneNode(true);\n    const section = tmpl.querySelector('.lift-section');\n    const idx = liftCount++;\n\n    section.dataset.liftIdx = idx;\n\n    if (liftName) section.querySelector('[name=\"lift_name[]\"]').value = liftName;\n    if (supersetId) section.querySelector('[name=\"lift_superset[]\"]').value = supersetId;\n\n    section.querySelector('.remove-lift-btn').addEventListener('click', () => {\n      section.remove();\n    });\n\n    section.querySelector('.add-set-btn').addEventListener('click', () => {\n      addSet(section);\n    });\n\n    document.getElementById('lifts-container').appendChild(tmpl);\n\n    if (sets && sets.length > 0) {\n      sets.forEach((s) => addSet(section, s.reps, s.weight));\n    } else {\n      addSet(section);\n    }\n\n    return section;\n  }\n\n  document.getElementById('add-lift-btn').addEventListener('click', () => addLift());\n\n  // Pre-populate from existing workout data\n  const existing = ";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "workoutJson")), env.opts.autoescape);
output += ";\n  if (existing && existing.lifts && existing.lifts.length > 0) {\n    existing.lifts.forEach((lift) => {\n      addLift(lift.lift_name, lift.superset_id || '', lift.sets);\n    });\n  } else {\n    addLift();\n  }\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/workouts/list.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/workouts/list.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-lg mx-auto\">\n\n  <div class=\"flex items-center justify-between mb-6\">\n    <h2 class=\"text-xl font-semibold\">Workout History</h2>\n    <a href=\"/workouts/new\"\n       class=\"text-sm text-indigo-600 hover:text-indigo-800 font-medium\">+ Log workout</a>\n  </div>\n\n  <div class=\"space-y-3\">\n    ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/workouts/list-items.njk", false, "pages/workouts/list.njk", false, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
callback(null,t_6);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
callback(null,t_8);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n  </div>\n\n</div>\n";
cb(null, output);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "pages/workouts/new.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.njk", true, "pages/workouts/new.njk", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"max-w-lg mx-auto\">\n\n  <div class=\"mb-6\">\n    <a href=\"/\" class=\"text-sm text-gray-500 hover:text-gray-700\">&larr; Home</a>\n  </div>\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "error")) {
output += "\n    <div class=\"mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm\">\n      ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "error"), env.opts.autoescape);
output += "\n    </div>\n  ";
;
}
output += "\n\n  <form id=\"workout-form\" method=\"POST\" action=\"/workouts/new\" class=\"space-y-6\">\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n\n    <!-- Date + Notes -->\n    <div class=\"space-y-3\">\n      <div>\n        <label for=\"date\" class=\"block text-sm font-medium text-gray-700 mb-1\">Date</label>\n        <input type=\"date\" id=\"date\" name=\"date\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "today"), env.opts.autoescape);
output += "\" required\n               class=\"border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n      </div>\n      <div>\n        <label for=\"notes\" class=\"block text-sm font-medium text-gray-700 mb-1\">Notes <span class=\"text-gray-400 font-normal\">(optional)</span></label>\n        <textarea id=\"notes\" name=\"notes\" rows=\"2\" maxlength=\"2000\"\n                  placeholder=\"How'd it go?\"\n                  class=\"w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none\"></textarea>\n      </div>\n    </div>\n\n    <!-- Lifts -->\n    <div>\n      <h3 class=\"text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide\">Lifts</h3>\n      <div id=\"lifts-container\" class=\"space-y-4\"></div>\n      <button type=\"button\" id=\"add-lift-btn\"\n              class=\"mt-3 w-full border border-dashed border-gray-300 hover:border-indigo-400 text-gray-500 hover:text-indigo-600 rounded-lg py-3 text-sm font-medium transition-colors\">\n        + Add Lift\n      </button>\n    </div>\n\n    <button type=\"submit\"\n            class=\"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors\">\n      Save Workout\n    </button>\n  </form>\n</div>\n\n<!-- Templates (not rendered, cloned by JS) -->\n<template id=\"lift-template\">\n  <div class=\"lift-section border border-gray-200 rounded-lg overflow-hidden\" data-lift-idx=\"\">\n    <div class=\"bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2\">\n      <input type=\"text\" name=\"lift_name[]\" placeholder=\"Lift name (e.g. Squat)\" required\n             maxlength=\"100\"\n             class=\"flex-1 bg-transparent text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none min-w-0\">\n      <input type=\"hidden\" name=\"lift_superset[]\" value=\"\">\n      <button type=\"button\" class=\"remove-lift-btn text-gray-400 hover:text-red-500 text-lg leading-none flex-shrink-0\" title=\"Remove lift\">&times;</button>\n    </div>\n    <div class=\"p-3 space-y-2\">\n      <div class=\"sets-container space-y-2\"></div>\n      <button type=\"button\" class=\"add-set-btn text-xs text-indigo-600 hover:text-indigo-800 font-medium\">\n        + Add set\n      </button>\n    </div>\n  </div>\n</template>\n\n<template id=\"set-template\">\n  <div class=\"set-row flex items-center gap-2\">\n    <input type=\"hidden\" name=\"set_lift[]\" value=\"\">\n    <span class=\"set-label text-xs text-gray-400 w-6 flex-shrink-0 text-center font-medium\"></span>\n    <div class=\"flex items-center gap-1 flex-1\">\n      <input type=\"number\" name=\"set_reps[]\" placeholder=\"Reps\" required\n             min=\"0\" max=\"9999\"\n             class=\"w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n      <span class=\"text-gray-400 text-xs flex-shrink-0\">×</span>\n      <input type=\"number\" name=\"set_weight[]\" placeholder=\"lbs\" required\n             min=\"0\" max=\"9999\" step=\"0.5\"\n             class=\"w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n      <span class=\"text-gray-400 text-xs flex-shrink-0\">lbs</span>\n    </div>\n    <button type=\"button\" class=\"remove-set-btn text-gray-300 hover:text-red-500 flex-shrink-0 leading-none\"\n            title=\"Remove set\">&times;</button>\n  </div>\n</template>\n\n<script>\n  let liftCount = 0;\n\n  function addSet(liftSection) {\n    const liftIdx = parseInt(liftSection.dataset.liftIdx);\n    const container = liftSection.querySelector('.sets-container');\n    const setIdx = container.querySelectorAll('.set-row').length;\n\n    const tmpl = document.getElementById('set-template').content.cloneNode(true);\n    const row = tmpl.querySelector('.set-row');\n\n    row.querySelector('[name=\"set_lift[]\"]').value = liftIdx;\n    row.querySelector('.set-label').textContent = setIdx + 1;\n\n    row.querySelector('.remove-set-btn').addEventListener('click', () => {\n      if (container.querySelectorAll('.set-row').length > 1) {\n        row.remove();\n        renumberSets(container);\n      }\n    });\n\n    container.appendChild(tmpl);\n  }\n\n  function renumberSets(container) {\n    container.querySelectorAll('.set-label').forEach((el, i) => {\n      el.textContent = i + 1;\n    });\n  }\n\n  function addLift() {\n    const tmpl = document.getElementById('lift-template').content.cloneNode(true);\n    const section = tmpl.querySelector('.lift-section');\n    const idx = liftCount++;\n\n    section.dataset.liftIdx = idx;\n\n    section.querySelector('.remove-lift-btn').addEventListener('click', () => {\n      section.remove();\n    });\n\n    section.querySelector('.add-set-btn').addEventListener('click', () => {\n      addSet(section);\n    });\n\n    document.getElementById('lifts-container').appendChild(tmpl);\n\n    // Add an initial set and focus the lift name input\n    addSet(section);\n    section.querySelector('[name=\"lift_name[]\"]').focus();\n  }\n\n  document.getElementById('add-lift-btn').addEventListener('click', addLift);\n\n  // Start with one lift\n  addLift();\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

  })(),
  "partials/bottom-nav.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
if(runtime.contextOrFrameLookup(context, frame, "user")) {
output += "\n<nav class=\"fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40\"\n     style=\"padding-bottom: env(safe-area-inset-bottom, 0)\">\n  <div class=\"max-w-lg mx-auto grid grid-cols-5 h-14\">\n\n    <a href=\"/\" class=\"flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors\">\n      <svg class=\"w-5 h-5\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" viewBox=\"0 0 24 24\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6\"/>\n      </svg>\n      <span class=\"text-xs font-medium\">Home</span>\n    </a>\n\n    <a href=\"/routines\" class=\"flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors\">\n      <svg class=\"w-5 h-5\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" viewBox=\"0 0 24 24\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z\"/>\n      </svg>\n      <span class=\"text-xs font-medium\">Routines</span>\n    </a>\n\n    <a href=\"/workouts/new\" class=\"flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors\">\n      <span class=\"flex items-center justify-center w-9 h-9 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors -mt-4 shadow-md\">\n        <svg class=\"w-5 h-5 text-white\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" viewBox=\"0 0 24 24\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 4v16m8-8H4\"/>\n        </svg>\n      </span>\n      <span class=\"text-xs font-medium -mt-0.5\">Log</span>\n    </a>\n\n    <a href=\"/workouts\" class=\"flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors\">\n      <svg class=\"w-5 h-5\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" viewBox=\"0 0 24 24\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01\"/>\n      </svg>\n      <span class=\"text-xs font-medium\">History</span>\n    </a>\n\n    <a href=\"/settings\" class=\"flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors\">\n      <svg class=\"w-5 h-5\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" viewBox=\"0 0 24 24\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>\n      </svg>\n      <span class=\"text-xs font-medium\">Settings</span>\n    </a>\n\n  </div>\n</nav>\n";
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/footer.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<footer class=\"border-t border-gray-200 mt-16 ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "user")?"pt-8 pb-24":"py-8"), env.opts.autoescape);
output += " text-center text-sm text-gray-500 space-y-2\">\n  <p><a href=\"/about\" class=\"text-indigo-600 hover:text-indigo-700 hover:underline\">About &amp; Disclaimers</a></p>\n  <p>&copy; ";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "year"),"2026"), env.opts.autoescape);
output += " Lift Log. <a href=\"https://github.com/ejyager00/workout-pwa\" class=\"text-indigo-600 hover:text-indigo-700 hover:underline\">Open source.</a> Built with <a href=\"https://github.com/ejyager00/htmx-crud-worker-template\">Cloudflare Workers</a>.</p>\n</footer>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/head.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n<title>";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "title"),"Lift Log"), env.opts.autoescape);
output += "</title>\n<meta name=\"application-name\" content=\"Lift Log\" />\n<meta name=\"theme-color\" content=\"#4f46e5\" />\n<link rel=\"icon\" href=\"/icons/favicon.ico\" sizes=\"any\" />\n<link rel=\"icon\" href=\"/icons/icon.svg\" type=\"image/svg+xml\" />\n<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/icons/favicon-32x32.png\" />\n<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/icons/favicon-16x16.png\" />\n<link rel=\"manifest\" href=\"/manifest.json\" />\n<!-- iOS add-to-home-screen -->\n<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />\n<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"default\" />\n<meta name=\"apple-mobile-web-app-title\" content=\"Lift Log\" />\n<link rel=\"apple-touch-icon\" href=\"/icons/apple-touch-icon.png\" />\n<!-- Tailwind CSS — built via `npm run tailwind:build` (src/styles/app.css → public/app.css) -->\n<link rel=\"stylesheet\" href=\"/app.css\" />\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("head"))(env, context, frame, runtime, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
output += t_1;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_head(env, context, frame, runtime, cb) {
var lineno = 17;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_head: b_head,
root: root
};

  })(),
  "partials/header.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<header class=\"bg-gray-50 border-b border-gray-200 py-8\">\n  <div class=\"max-w-5xl mx-auto px-4\">\n    <h1 class=\"text-2xl font-bold text-gray-900\">";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "pageTitle"),runtime.contextOrFrameLookup(context, frame, "title")), env.opts.autoescape);
output += "</h1>\n  </div>\n</header>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/home/lifts-panel.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<div id=\"lifts-panel\">\n\n  ";
output += "\n\n  ";
output += "\n  <form id=\"complete-form\" method=\"POST\" action=\"/complete\">\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n    <input type=\"hidden\" name=\"date\"  value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "today"), env.opts.autoescape);
output += "\">\n    ";
output += "\n    ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "groups");
if(t_3) {t_3 = runtime.fromIterator(t_3);
var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("group", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n      ";
frame = frame.push();
var t_7 = runtime.memberLookup((t_4),"items");
if(t_7) {t_7 = runtime.fromIterator(t_7);
var t_6 = t_7.length;
for(var t_5=0; t_5 < t_7.length; t_5++) {
var t_8 = t_7[t_5];
frame.set("item", t_8);
frame.set("loop.index", t_5 + 1);
frame.set("loop.index0", t_5);
frame.set("loop.revindex", t_6 - t_5);
frame.set("loop.revindex0", t_6 - t_5 - 1);
frame.set("loop.first", t_5 === 0);
frame.set("loop.last", t_5 === t_6 - 1);
frame.set("loop.length", t_6);
output += "\n        <input type=\"hidden\" name=\"lift_name[]\"    value=\"";
output += runtime.suppressValue(runtime.memberLookup((t_8),"lift_name"), env.opts.autoescape);
output += "\"           form=\"complete-form\">\n        <input type=\"hidden\" name=\"lift_superset[]\" value=\"";
output += runtime.suppressValue((runtime.memberLookup((t_8),"superset_id")?runtime.memberLookup((t_8),"superset_id"):""), env.opts.autoescape);
output += "\" form=\"complete-form\">\n      ";
;
}
}
frame = frame.pop();
output += "\n    ";
;
}
}
frame = frame.pop();
output += "\n  </form>\n\n  ";
output += "\n  <form id=\"superset-form\" method=\"POST\" action=\"/override/superset\"\n        hx-post=\"/override/superset\" hx-target=\"#lifts-panel\" hx-swap=\"outerHTML\">\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n  </form>\n\n  ";
output += "\n  <div class=\"space-y-3 mb-4\">\n\n    ";
if(env.getFilter("length").call(context, runtime.contextOrFrameLookup(context, frame, "groups")) == 0) {
output += "\n      <p class=\"text-center text-sm text-gray-400 py-6\">\n        No lifts yet today.";
if(!runtime.contextOrFrameLookup(context, frame, "completed")) {
output += " Add one below.";
;
}
output += "\n      </p>\n    ";
;
}
output += "\n\n    ";
frame = frame.push();
var t_11 = runtime.contextOrFrameLookup(context, frame, "groups");
if(t_11) {t_11 = runtime.fromIterator(t_11);
var t_10 = t_11.length;
for(var t_9=0; t_9 < t_11.length; t_9++) {
var t_12 = t_11[t_9];
frame.set("group", t_12);
frame.set("loop.index", t_9 + 1);
frame.set("loop.index0", t_9);
frame.set("loop.revindex", t_10 - t_9);
frame.set("loop.revindex0", t_10 - t_9 - 1);
frame.set("loop.first", t_9 === 0);
frame.set("loop.last", t_9 === t_10 - 1);
frame.set("loop.length", t_10);
output += "\n\n      ";
if(runtime.memberLookup((t_12),"type") == "standalone") {
output += "\n        ";
var t_13;
t_13 = runtime.memberLookup((runtime.memberLookup((t_12),"items")),0);
frame.set("item", t_13, true);
if(frame.topLevel) {
context.setVariable("item", t_13);
}
if(frame.topLevel) {
context.addExport("item", t_13);
}
output += "\n        <div class=\"border border-gray-200 rounded-lg bg-white overflow-hidden\">\n\n          ";
output += "\n          <div class=\"flex items-start gap-2 px-3 pt-3 pb-2\">\n            ";
if(!runtime.contextOrFrameLookup(context, frame, "completed")) {
output += "\n              <input type=\"checkbox\" name=\"item_ids[]\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "\"\n                     form=\"superset-form\"\n                     class=\"mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 flex-shrink-0\">\n            ";
;
}
output += "\n            <div class=\"flex-1 min-w-0\">\n              <p class=\"font-medium text-gray-900 text-sm truncate\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"lift_name"), env.opts.autoescape);
output += "</p>\n              <p class=\"text-xs text-gray-500\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"reps_min"), env.opts.autoescape);
output += "–";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"reps_max"), env.opts.autoescape);
output += " reps &times; ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"sets"), env.opts.autoescape);
output += " sets</p>\n            </div>\n            ";
if(!runtime.contextOrFrameLookup(context, frame, "completed")) {
output += "\n              <div class=\"flex gap-1 flex-shrink-0\">\n                <form method=\"POST\" action=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/move\"\n                      hx-post=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/move\"\n                      hx-target=\"#lifts-panel\" hx-swap=\"outerHTML\">\n                  <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                  <input type=\"hidden\" name=\"direction\" value=\"up\">\n                  <button type=\"submit\" class=\"text-gray-400 hover:text-gray-600 p-0.5\">&#8593;</button>\n                </form>\n                <form method=\"POST\" action=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/move\"\n                      hx-post=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/move\"\n                      hx-target=\"#lifts-panel\" hx-swap=\"outerHTML\">\n                  <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                  <input type=\"hidden\" name=\"direction\" value=\"down\">\n                  <button type=\"submit\" class=\"text-gray-400 hover:text-gray-600 p-0.5\">&#8595;</button>\n                </form>\n                <form method=\"POST\" action=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/delete\"\n                      hx-post=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/delete\"\n                      hx-target=\"#lifts-panel\" hx-swap=\"outerHTML\">\n                  <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                  <button type=\"submit\" hx-confirm=\"Remove ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"lift_name"), env.opts.autoescape);
output += " from today?\"\n                          class=\"text-red-400 hover:text-red-600 p-0.5\">&times;</button>\n                </form>\n              </div>\n            ";
;
}
output += "\n          </div>\n\n          ";
output += "\n          ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"stat") && (runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"stat")),"recentDate") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"stat")),"bestDate"))) {
output += "\n            <div class=\"px-3 pb-2 space-y-0.5\">\n              ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"stat")),"recentDate")) {
output += "\n                <p class=\"text-xs text-gray-400\">\n                  <span class=\"font-medium text-gray-500\">Last</span>\n                  ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"stat")),"recentDate"), env.opts.autoescape);
output += " &middot;\n                  ";
frame = frame.push();
var t_16 = runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"stat")),"recentSets");
if(t_16) {t_16 = runtime.fromIterator(t_16);
var t_15 = t_16.length;
for(var t_14=0; t_14 < t_16.length; t_14++) {
var t_17 = t_16[t_14];
frame.set("s", t_17);
frame.set("loop.index", t_14 + 1);
frame.set("loop.index0", t_14);
frame.set("loop.revindex", t_15 - t_14);
frame.set("loop.revindex0", t_15 - t_14 - 1);
frame.set("loop.first", t_14 === 0);
frame.set("loop.last", t_14 === t_15 - 1);
frame.set("loop.length", t_15);
output += runtime.suppressValue(runtime.memberLookup((t_17),"reps"), env.opts.autoescape);
output += "&times;";
output += runtime.suppressValue(runtime.memberLookup((t_17),"weight"), env.opts.autoescape);
if(!runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"last")) {
output += ", ";
;
}
;
}
}
frame = frame.pop();
output += "\n                </p>\n              ";
;
}
output += "\n              ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"stat")),"bestDate")) {
output += "\n                <p class=\"text-xs text-gray-400\">\n                  <span class=\"font-medium text-gray-500\">Best</span>\n                  ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"stat")),"bestDate"), env.opts.autoescape);
output += " &middot;\n                  ";
frame = frame.push();
var t_20 = runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"stat")),"bestSets");
if(t_20) {t_20 = runtime.fromIterator(t_20);
var t_19 = t_20.length;
for(var t_18=0; t_18 < t_20.length; t_18++) {
var t_21 = t_20[t_18];
frame.set("s", t_21);
frame.set("loop.index", t_18 + 1);
frame.set("loop.index0", t_18);
frame.set("loop.revindex", t_19 - t_18);
frame.set("loop.revindex0", t_19 - t_18 - 1);
frame.set("loop.first", t_18 === 0);
frame.set("loop.last", t_18 === t_19 - 1);
frame.set("loop.length", t_19);
output += runtime.suppressValue(runtime.memberLookup((t_21),"reps"), env.opts.autoescape);
output += "&times;";
output += runtime.suppressValue(runtime.memberLookup((t_21),"weight"), env.opts.autoescape);
if(!runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"last")) {
output += ", ";
;
}
;
}
}
frame = frame.pop();
output += "\n                </p>\n              ";
;
}
output += "\n            </div>\n          ";
;
}
output += "\n\n          ";
output += "\n          ";
if(runtime.contextOrFrameLookup(context, frame, "inlineLogging") && !runtime.contextOrFrameLookup(context, frame, "completed")) {
output += "\n            <div class=\"border-t border-gray-100 px-3 py-2 space-y-1.5\">\n              ";
frame = frame.push();
var t_24 = (lineno = 99, colno = 31, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "range"), "range", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"sets")]));
if(t_24) {t_24 = runtime.fromIterator(t_24);
var t_23 = t_24.length;
for(var t_22=0; t_22 < t_24.length; t_22++) {
var t_25 = t_24[t_22];
frame.set("s", t_25);
frame.set("loop.index", t_22 + 1);
frame.set("loop.index0", t_22);
frame.set("loop.revindex", t_23 - t_22);
frame.set("loop.revindex0", t_23 - t_22 - 1);
frame.set("loop.first", t_22 === 0);
frame.set("loop.last", t_22 === t_23 - 1);
frame.set("loop.length", t_23);
output += "\n                <div class=\"flex items-center gap-2\">\n                  <span class=\"text-xs text-gray-400 w-10 flex-shrink-0\">Set ";
output += runtime.suppressValue(t_25 + 1, env.opts.autoescape);
output += "</span>\n                  <input type=\"hidden\" name=\"set_lift[]\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"flatIdx"), env.opts.autoescape);
output += "\" form=\"complete-form\">\n                  <input type=\"number\" name=\"set_reps[]\" placeholder=\"Reps\" min=\"0\" max=\"9999\"\n                         form=\"complete-form\"\n                         class=\"w-full border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n                  <span class=\"text-gray-400 text-xs flex-shrink-0\">&times;</span>\n                  <input type=\"number\" name=\"set_weight[]\" placeholder=\"lbs\" min=\"0\" max=\"9999\" step=\"0.5\"\n                         form=\"complete-form\"\n                         class=\"w-full border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n                  <span class=\"text-xs text-gray-400 flex-shrink-0\">lbs</span>\n                </div>\n              ";
;
}
}
frame = frame.pop();
output += "\n            </div>\n          ";
;
}
output += "\n\n        </div>\n\n      ";
;
}
else {
output += "\n        ";
output += "\n        <div class=\"border-2 border-indigo-200 rounded-lg overflow-hidden bg-indigo-50\">\n\n          <div class=\"flex items-center justify-between px-3 py-1.5 bg-indigo-100 border-b border-indigo-200\">\n            <span class=\"text-xs font-semibold text-indigo-700 uppercase tracking-wide\">Superset</span>\n            ";
if(!runtime.contextOrFrameLookup(context, frame, "completed")) {
output += "\n              <div class=\"flex gap-1\">\n                <form method=\"POST\" action=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_12),"items")),0)),"id"), env.opts.autoescape);
output += "/move\"\n                      hx-post=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_12),"items")),0)),"id"), env.opts.autoescape);
output += "/move\"\n                      hx-target=\"#lifts-panel\" hx-swap=\"outerHTML\" class=\"inline\">\n                  <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                  <input type=\"hidden\" name=\"direction\" value=\"up\">\n                  <button type=\"submit\" class=\"text-indigo-400 hover:text-indigo-700 text-sm px-1\">&#8593;</button>\n                </form>\n                <form method=\"POST\" action=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_12),"items")),0)),"id"), env.opts.autoescape);
output += "/move\"\n                      hx-post=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_12),"items")),0)),"id"), env.opts.autoescape);
output += "/move\"\n                      hx-target=\"#lifts-panel\" hx-swap=\"outerHTML\" class=\"inline\">\n                  <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                  <input type=\"hidden\" name=\"direction\" value=\"down\">\n                  <button type=\"submit\" class=\"text-indigo-400 hover:text-indigo-700 text-sm px-1\">&#8595;</button>\n                </form>\n              </div>\n            ";
;
}
output += "\n          </div>\n\n          <div class=\"divide-y divide-indigo-100\">\n            ";
frame = frame.push();
var t_28 = runtime.memberLookup((t_12),"items");
if(t_28) {t_28 = runtime.fromIterator(t_28);
var t_27 = t_28.length;
for(var t_26=0; t_26 < t_28.length; t_26++) {
var t_29 = t_28[t_26];
frame.set("item", t_29);
frame.set("loop.index", t_26 + 1);
frame.set("loop.index0", t_26);
frame.set("loop.revindex", t_27 - t_26);
frame.set("loop.revindex0", t_27 - t_26 - 1);
frame.set("loop.first", t_26 === 0);
frame.set("loop.last", t_26 === t_27 - 1);
frame.set("loop.length", t_27);
output += "\n              <div class=\"px-3 pt-2.5 pb-2\">\n\n                <div class=\"flex items-start gap-2\">\n                  <div class=\"flex-1 min-w-0\">\n                    <p class=\"font-medium text-gray-900 text-sm truncate\">";
output += runtime.suppressValue(runtime.memberLookup((t_29),"lift_name"), env.opts.autoescape);
output += "</p>\n                    <p class=\"text-xs text-gray-500\">";
output += runtime.suppressValue(runtime.memberLookup((t_29),"reps_min"), env.opts.autoescape);
output += "–";
output += runtime.suppressValue(runtime.memberLookup((t_29),"reps_max"), env.opts.autoescape);
output += " reps &times; ";
output += runtime.suppressValue(runtime.memberLookup((t_29),"sets"), env.opts.autoescape);
output += " sets</p>\n                  </div>\n                  ";
if(!runtime.contextOrFrameLookup(context, frame, "completed")) {
output += "\n                    <div class=\"flex items-center gap-2 flex-shrink-0\">\n                      <form method=\"POST\" action=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((t_29),"id"), env.opts.autoescape);
output += "/unsuperset\"\n                            hx-post=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((t_29),"id"), env.opts.autoescape);
output += "/unsuperset\"\n                            hx-target=\"#lifts-panel\" hx-swap=\"outerHTML\">\n                        <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                        <button type=\"submit\" class=\"text-xs text-indigo-500 hover:text-indigo-700\">Ungroup</button>\n                      </form>\n                      <form method=\"POST\" action=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((t_29),"id"), env.opts.autoescape);
output += "/delete\"\n                            hx-post=\"/override/items/";
output += runtime.suppressValue(runtime.memberLookup((t_29),"id"), env.opts.autoescape);
output += "/delete\"\n                            hx-target=\"#lifts-panel\" hx-swap=\"outerHTML\">\n                        <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                        <button type=\"submit\" hx-confirm=\"Remove ";
output += runtime.suppressValue(runtime.memberLookup((t_29),"lift_name"), env.opts.autoescape);
output += " from today?\"\n                                class=\"text-red-400 hover:text-red-600\">&times;</button>\n                      </form>\n                    </div>\n                  ";
;
}
output += "\n                </div>\n\n                ";
output += "\n                ";
if(runtime.memberLookup((t_29),"stat") && (runtime.memberLookup((runtime.memberLookup((t_29),"stat")),"recentDate") || runtime.memberLookup((runtime.memberLookup((t_29),"stat")),"bestDate"))) {
output += "\n                  <div class=\"mt-1 space-y-0.5\">\n                    ";
if(runtime.memberLookup((runtime.memberLookup((t_29),"stat")),"recentDate")) {
output += "\n                      <p class=\"text-xs text-gray-400\">\n                        <span class=\"font-medium text-gray-500\">Last</span>\n                        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_29),"stat")),"recentDate"), env.opts.autoescape);
output += " &middot;\n                        ";
frame = frame.push();
var t_32 = runtime.memberLookup((runtime.memberLookup((t_29),"stat")),"recentSets");
if(t_32) {t_32 = runtime.fromIterator(t_32);
var t_31 = t_32.length;
for(var t_30=0; t_30 < t_32.length; t_30++) {
var t_33 = t_32[t_30];
frame.set("s", t_33);
frame.set("loop.index", t_30 + 1);
frame.set("loop.index0", t_30);
frame.set("loop.revindex", t_31 - t_30);
frame.set("loop.revindex0", t_31 - t_30 - 1);
frame.set("loop.first", t_30 === 0);
frame.set("loop.last", t_30 === t_31 - 1);
frame.set("loop.length", t_31);
output += runtime.suppressValue(runtime.memberLookup((t_33),"reps"), env.opts.autoescape);
output += "&times;";
output += runtime.suppressValue(runtime.memberLookup((t_33),"weight"), env.opts.autoescape);
if(!runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"last")) {
output += ", ";
;
}
;
}
}
frame = frame.pop();
output += "\n                      </p>\n                    ";
;
}
output += "\n                    ";
if(runtime.memberLookup((runtime.memberLookup((t_29),"stat")),"bestDate")) {
output += "\n                      <p class=\"text-xs text-gray-400\">\n                        <span class=\"font-medium text-gray-500\">Best</span>\n                        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_29),"stat")),"bestDate"), env.opts.autoescape);
output += " &middot;\n                        ";
frame = frame.push();
var t_36 = runtime.memberLookup((runtime.memberLookup((t_29),"stat")),"bestSets");
if(t_36) {t_36 = runtime.fromIterator(t_36);
var t_35 = t_36.length;
for(var t_34=0; t_34 < t_36.length; t_34++) {
var t_37 = t_36[t_34];
frame.set("s", t_37);
frame.set("loop.index", t_34 + 1);
frame.set("loop.index0", t_34);
frame.set("loop.revindex", t_35 - t_34);
frame.set("loop.revindex0", t_35 - t_34 - 1);
frame.set("loop.first", t_34 === 0);
frame.set("loop.last", t_34 === t_35 - 1);
frame.set("loop.length", t_35);
output += runtime.suppressValue(runtime.memberLookup((t_37),"reps"), env.opts.autoescape);
output += "&times;";
output += runtime.suppressValue(runtime.memberLookup((t_37),"weight"), env.opts.autoescape);
if(!runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"last")) {
output += ", ";
;
}
;
}
}
frame = frame.pop();
output += "\n                      </p>\n                    ";
;
}
output += "\n                  </div>\n                ";
;
}
output += "\n\n                ";
output += "\n                ";
if(runtime.contextOrFrameLookup(context, frame, "inlineLogging") && !runtime.contextOrFrameLookup(context, frame, "completed")) {
output += "\n                  <div class=\"mt-2 space-y-1.5\">\n                    ";
frame = frame.push();
var t_40 = (lineno = 195, colno = 37, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "range"), "range", context, [runtime.memberLookup((t_29),"sets")]));
if(t_40) {t_40 = runtime.fromIterator(t_40);
var t_39 = t_40.length;
for(var t_38=0; t_38 < t_40.length; t_38++) {
var t_41 = t_40[t_38];
frame.set("s", t_41);
frame.set("loop.index", t_38 + 1);
frame.set("loop.index0", t_38);
frame.set("loop.revindex", t_39 - t_38);
frame.set("loop.revindex0", t_39 - t_38 - 1);
frame.set("loop.first", t_38 === 0);
frame.set("loop.last", t_38 === t_39 - 1);
frame.set("loop.length", t_39);
output += "\n                      <div class=\"flex items-center gap-2\">\n                        <span class=\"text-xs text-gray-400 w-10 flex-shrink-0\">Set ";
output += runtime.suppressValue(t_41 + 1, env.opts.autoescape);
output += "</span>\n                        <input type=\"hidden\" name=\"set_lift[]\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((t_29),"flatIdx"), env.opts.autoescape);
output += "\" form=\"complete-form\">\n                        <input type=\"number\" name=\"set_reps[]\" placeholder=\"Reps\" min=\"0\" max=\"9999\"\n                               form=\"complete-form\"\n                               class=\"w-full border border-indigo-200 rounded px-2 py-1 text-sm text-center bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n                        <span class=\"text-gray-400 text-xs flex-shrink-0\">&times;</span>\n                        <input type=\"number\" name=\"set_weight[]\" placeholder=\"lbs\" min=\"0\" max=\"9999\" step=\"0.5\"\n                               form=\"complete-form\"\n                               class=\"w-full border border-indigo-200 rounded px-2 py-1 text-sm text-center bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n                        <span class=\"text-xs text-gray-400 flex-shrink-0\">lbs</span>\n                      </div>\n                    ";
;
}
}
frame = frame.pop();
output += "\n                  </div>\n                ";
;
}
output += "\n\n              </div>\n            ";
;
}
}
frame = frame.pop();
output += "\n          </div>\n\n        </div>\n      ";
;
}
output += "\n\n    ";
;
}
}
frame = frame.pop();
output += "\n\n  </div>\n\n  ";
output += "\n  ";
if(!runtime.contextOrFrameLookup(context, frame, "completed") && env.getFilter("length").call(context, runtime.contextOrFrameLookup(context, frame, "groups")) >= 2) {
output += "\n    <div class=\"mb-4\">\n      <button type=\"submit\" form=\"superset-form\"\n              class=\"text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 rounded px-3 py-1.5 transition-colors\">\n        Group selected as superset\n      </button>\n    </div>\n  ";
;
}
output += "\n\n  ";
output += "\n  ";
if(!runtime.contextOrFrameLookup(context, frame, "completed")) {
output += "\n    <div class=\"border border-dashed border-gray-300 rounded-lg p-3 mb-4\">\n      <p class=\"text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide\">Add lift for today</p>\n      <form method=\"POST\" action=\"/override/items\"\n            hx-post=\"/override/items\" hx-target=\"#lifts-panel\" hx-swap=\"outerHTML\"\n            hx-on::after-request=\"this.reset()\">\n        <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n        <div class=\"flex flex-wrap gap-2 items-center\">\n          <input type=\"text\" name=\"lift_name\" placeholder=\"Lift name\" required maxlength=\"100\"\n                 class=\"flex-1 min-w-32 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n          <div class=\"flex items-center gap-1 flex-shrink-0\">\n            <input type=\"number\" name=\"reps_min\" value=\"8\" min=\"1\" max=\"999\" required\n                   class=\"w-14 border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n            <span class=\"text-gray-400 text-xs\">–</span>\n            <input type=\"number\" name=\"reps_max\" value=\"12\" min=\"1\" max=\"999\" required\n                   class=\"w-14 border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n            <span class=\"text-gray-500 text-xs ml-1\">reps</span>\n          </div>\n          <div class=\"flex items-center gap-1 flex-shrink-0\">\n            <input type=\"number\" name=\"sets\" value=\"3\" min=\"1\" max=\"99\" required\n                   class=\"w-12 border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n            <span class=\"text-gray-500 text-xs\">sets</span>\n          </div>\n          <button type=\"submit\"\n                  class=\"bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-1.5 px-3 rounded transition-colors flex-shrink-0\">\n            + Add\n          </button>\n        </div>\n      </form>\n    </div>\n  ";
;
}
output += "\n\n  ";
output += "\n  ";
if(!runtime.contextOrFrameLookup(context, frame, "completed")) {
output += "\n    <button type=\"submit\" form=\"complete-form\"\n            class=\"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-sm transition-colors\">\n      Complete Workout\n    </button>\n  ";
;
}
output += "\n\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/nav.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<nav class=\"bg-white border-b border-gray-200\">\n  <div class=\"max-w-5xl mx-auto px-4 py-3 flex items-center justify-between\">\n    <a href=\"/\" class=\"font-semibold text-gray-900 text-lg tracking-tight\">Lift Log</a>\n    <div class=\"flex gap-4 text-sm items-center\">\n      ";
if(runtime.contextOrFrameLookup(context, frame, "user")) {
output += "\n        <span class=\"text-gray-500 text-xs\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username"), env.opts.autoescape);
output += "</span>\n        <form method=\"POST\" action=\"/auth/logout\" class=\"inline\">\n          <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n          <button type=\"submit\" class=\"text-sm text-gray-500 hover:text-red-600 transition-colors\">Log out</button>\n        </form>\n      ";
;
}
else {
output += "\n        <a href=\"/auth/login\" class=\"text-gray-700 hover:underline\">Log in</a>\n        <a href=\"/auth/signup\" class=\"text-indigo-600 hover:underline font-medium\">Sign up</a>\n      ";
;
}
output += "\n    </div>\n  </div>\n</nav>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/routines/items-list.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<div id=\"items-list\">\n\n  ";
output += "\n  <form id=\"superset-form\" method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/superset\"\n        hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/superset\"\n        hx-target=\"#items-list\" hx-swap=\"outerHTML\">\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n  </form>\n\n  <!-- Lift list -->\n  <div class=\"space-y-2 mb-4\">\n\n    ";
if(env.getFilter("length").call(context, runtime.contextOrFrameLookup(context, frame, "groups")) == 0) {
output += "\n      <p class=\"text-gray-400 text-sm py-4 text-center\">No lifts yet. Add one below.</p>\n    ";
;
}
output += "\n\n    ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "groups");
if(t_3) {t_3 = runtime.fromIterator(t_3);
var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("group", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n\n      ";
if(runtime.memberLookup((t_4),"type") == "standalone") {
output += "\n        ";
var t_5;
t_5 = runtime.memberLookup((runtime.memberLookup((t_4),"items")),0);
frame.set("item", t_5, true);
if(frame.topLevel) {
context.setVariable("item", t_5);
}
if(frame.topLevel) {
context.addExport("item", t_5);
}
output += "\n\n        <div class=\"border border-gray-200 rounded-lg bg-white\">\n          <div class=\"flex items-start gap-2 p-3\">\n\n            ";
output += "\n            <input type=\"checkbox\" name=\"item_ids[]\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "\"\n                   form=\"superset-form\"\n                   class=\"mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 flex-shrink-0\">\n\n            ";
output += "\n            <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "\"\n                  hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "\"\n                  hx-target=\"#items-list\" hx-swap=\"outerHTML\"\n                  class=\"flex-1 min-w-0\">\n              <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n              <div class=\"flex flex-wrap gap-2 items-center\">\n                <input type=\"text\" name=\"lift_name\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"lift_name"), env.opts.autoescape);
output += "\"\n                       placeholder=\"Lift name\" required maxlength=\"100\"\n                       class=\"flex-1 min-w-32 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n                <div class=\"flex items-center gap-1 flex-shrink-0\">\n                  <input type=\"number\" name=\"reps_min\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"reps_min"), env.opts.autoescape);
output += "\"\n                         min=\"1\" max=\"999\" required\n                         class=\"w-14 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n                  <span class=\"text-gray-400 text-xs\">–</span>\n                  <input type=\"number\" name=\"reps_max\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"reps_max"), env.opts.autoescape);
output += "\"\n                         min=\"1\" max=\"999\" required\n                         class=\"w-14 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n                  <span class=\"text-gray-500 text-xs ml-1\">reps</span>\n                </div>\n                <div class=\"flex items-center gap-1 flex-shrink-0\">\n                  <input type=\"number\" name=\"sets\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"sets"), env.opts.autoescape);
output += "\"\n                         min=\"1\" max=\"99\" required\n                         class=\"w-12 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500\">\n                  <span class=\"text-gray-500 text-xs\">sets</span>\n                </div>\n                <button type=\"submit\"\n                        class=\"text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-1 px-2 rounded transition-colors flex-shrink-0\">\n                  Save\n                </button>\n              </div>\n            </form>\n\n            ";
output += "\n            <div class=\"flex flex-col gap-1 flex-shrink-0\">\n              <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/move\"\n                    hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/move\"\n                    hx-target=\"#items-list\" hx-swap=\"outerHTML\">\n                <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                <input type=\"hidden\" name=\"direction\" value=\"up\">\n                <button type=\"submit\" title=\"Move up\"\n                        class=\"text-gray-400 hover:text-gray-600 p-0.5 leading-none\">&#8593;</button>\n              </form>\n              <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/move\"\n                    hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/move\"\n                    hx-target=\"#items-list\" hx-swap=\"outerHTML\">\n                <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                <input type=\"hidden\" name=\"direction\" value=\"down\">\n                <button type=\"submit\" title=\"Move down\"\n                        class=\"text-gray-400 hover:text-gray-600 p-0.5 leading-none\">&#8595;</button>\n              </form>\n              <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/delete\"\n                    hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "/delete\"\n                    hx-target=\"#items-list\" hx-swap=\"outerHTML\">\n                <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                <button type=\"submit\" title=\"Remove lift\"\n                        hx-confirm=\"Remove this lift?\"\n                        class=\"text-red-400 hover:text-red-600 p-0.5 leading-none\">&times;</button>\n              </form>\n            </div>\n\n          </div>\n        </div>\n\n      ";
;
}
else {
output += "\n        ";
output += "\n        <div class=\"border-2 border-indigo-200 rounded-lg bg-indigo-50 overflow-hidden\">\n\n          ";
output += "\n          <div class=\"flex items-center justify-between px-3 py-1.5 bg-indigo-100 border-b border-indigo-200\">\n            <span class=\"text-xs font-semibold text-indigo-700 uppercase tracking-wide\">Superset</span>\n            <div class=\"flex gap-2\">\n              <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_4),"items")),0)),"id"), env.opts.autoescape);
output += "/move\"\n                    hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_4),"items")),0)),"id"), env.opts.autoescape);
output += "/move\"\n                    hx-target=\"#items-list\" hx-swap=\"outerHTML\" class=\"inline\">\n                <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                <input type=\"hidden\" name=\"direction\" value=\"up\">\n                <button type=\"submit\" title=\"Move group up\"\n                        class=\"text-indigo-500 hover:text-indigo-700 text-sm px-1\">&#8593;</button>\n              </form>\n              <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_4),"items")),0)),"id"), env.opts.autoescape);
output += "/move\"\n                    hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_4),"items")),0)),"id"), env.opts.autoescape);
output += "/move\"\n                    hx-target=\"#items-list\" hx-swap=\"outerHTML\" class=\"inline\">\n                <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                <input type=\"hidden\" name=\"direction\" value=\"down\">\n                <button type=\"submit\" title=\"Move group down\"\n                        class=\"text-indigo-500 hover:text-indigo-700 text-sm px-1\">&#8595;</button>\n              </form>\n            </div>\n          </div>\n\n          ";
output += "\n          <div class=\"divide-y divide-indigo-100\">\n            ";
frame = frame.push();
var t_8 = runtime.memberLookup((t_4),"items");
if(t_8) {t_8 = runtime.fromIterator(t_8);
var t_7 = t_8.length;
for(var t_6=0; t_6 < t_8.length; t_6++) {
var t_9 = t_8[t_6];
frame.set("item", t_9);
frame.set("loop.index", t_6 + 1);
frame.set("loop.index0", t_6);
frame.set("loop.revindex", t_7 - t_6);
frame.set("loop.revindex0", t_7 - t_6 - 1);
frame.set("loop.first", t_6 === 0);
frame.set("loop.last", t_6 === t_7 - 1);
frame.set("loop.length", t_7);
output += "\n              <div class=\"flex items-start gap-2 p-3\">\n\n                ";
output += "\n                <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"id"), env.opts.autoescape);
output += "\"\n                      hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"id"), env.opts.autoescape);
output += "\"\n                      hx-target=\"#items-list\" hx-swap=\"outerHTML\"\n                      class=\"flex-1 min-w-0\">\n                  <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                  <div class=\"flex flex-wrap gap-2 items-center\">\n                    <input type=\"text\" name=\"lift_name\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((t_9),"lift_name"), env.opts.autoescape);
output += "\"\n                           placeholder=\"Lift name\" required maxlength=\"100\"\n                           class=\"flex-1 min-w-32 border border-indigo-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white\">\n                    <div class=\"flex items-center gap-1 flex-shrink-0\">\n                      <input type=\"number\" name=\"reps_min\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((t_9),"reps_min"), env.opts.autoescape);
output += "\"\n                             min=\"1\" max=\"999\" required\n                             class=\"w-14 border border-indigo-200 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white\">\n                      <span class=\"text-gray-400 text-xs\">–</span>\n                      <input type=\"number\" name=\"reps_max\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((t_9),"reps_max"), env.opts.autoescape);
output += "\"\n                             min=\"1\" max=\"999\" required\n                             class=\"w-14 border border-indigo-200 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white\">\n                      <span class=\"text-gray-500 text-xs ml-1\">reps</span>\n                    </div>\n                    <div class=\"flex items-center gap-1 flex-shrink-0\">\n                      <input type=\"number\" name=\"sets\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((t_9),"sets"), env.opts.autoescape);
output += "\"\n                             min=\"1\" max=\"99\" required\n                             class=\"w-12 border border-indigo-200 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white\">\n                      <span class=\"text-gray-500 text-xs\">sets</span>\n                    </div>\n                    <button type=\"submit\"\n                            class=\"text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-1 px-2 rounded transition-colors flex-shrink-0\">\n                      Save\n                    </button>\n                  </div>\n                </form>\n\n                ";
output += "\n                <div class=\"flex flex-col gap-1 flex-shrink-0\">\n                  <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"id"), env.opts.autoescape);
output += "/unsuperset\"\n                        hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"id"), env.opts.autoescape);
output += "/unsuperset\"\n                        hx-target=\"#items-list\" hx-swap=\"outerHTML\">\n                    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                    <button type=\"submit\" title=\"Remove from superset\"\n                            class=\"text-xs text-indigo-500 hover:text-indigo-700 p-0.5 leading-none whitespace-nowrap\">\n                      Ungroup\n                    </button>\n                  </form>\n                  <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"id"), env.opts.autoescape);
output += "/delete\"\n                        hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items/";
output += runtime.suppressValue(runtime.memberLookup((t_9),"id"), env.opts.autoescape);
output += "/delete\"\n                        hx-target=\"#items-list\" hx-swap=\"outerHTML\">\n                    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n                    <button type=\"submit\" title=\"Remove lift\"\n                            hx-confirm=\"Remove this lift?\"\n                            class=\"text-red-400 hover:text-red-600 p-0.5 leading-none\">&times;</button>\n                  </form>\n                </div>\n\n              </div>\n            ";
;
}
}
frame = frame.pop();
output += "\n          </div>\n        </div>\n\n      ";
;
}
output += "\n    ";
;
}
}
frame = frame.pop();
output += "\n\n  </div>\n\n  ";
output += "\n  ";
if(env.getFilter("length").call(context, runtime.contextOrFrameLookup(context, frame, "groups")) >= 2) {
output += "\n    <div class=\"mb-4\">\n      <button type=\"submit\" form=\"superset-form\"\n              class=\"text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 rounded px-3 py-1.5 transition-colors\">\n        Group selected as superset\n      </button>\n    </div>\n  ";
;
}
output += "\n\n  <!-- Add lift form -->\n  <div class=\"border border-dashed border-gray-300 rounded-lg p-3\">\n    <p class=\"text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide\">Add lift</p>\n    <form method=\"POST\" action=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items\"\n          hx-post=\"/routines/";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.opts.autoescape);
output += "/items\"\n          hx-target=\"#items-list\" hx-swap=\"outerHTML\"\n          hx-on::after-request=\"this.reset()\">\n      <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n      <div class=\"flex flex-wrap gap-2 items-center\">\n        <input type=\"text\" name=\"lift_name\" placeholder=\"Lift name\" required maxlength=\"100\"\n               class=\"flex-1 min-w-32 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n        <div class=\"flex items-center gap-1 flex-shrink-0\">\n          <input type=\"number\" name=\"reps_min\" value=\"8\" min=\"1\" max=\"999\" required\n                 class=\"w-14 border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n          <span class=\"text-gray-400 text-xs\">–</span>\n          <input type=\"number\" name=\"reps_max\" value=\"12\" min=\"1\" max=\"999\" required\n                 class=\"w-14 border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n          <span class=\"text-gray-500 text-xs ml-1\">reps</span>\n        </div>\n        <div class=\"flex items-center gap-1 flex-shrink-0\">\n          <input type=\"number\" name=\"sets\" value=\"3\" min=\"1\" max=\"99\" required\n                 class=\"w-12 border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n          <span class=\"text-gray-500 text-xs\">sets</span>\n        </div>\n        <button type=\"submit\"\n                class=\"bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-1.5 px-3 rounded transition-colors flex-shrink-0\">\n          + Add\n        </button>\n      </div>\n    </form>\n  </div>\n\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/settings/api-keys.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<div id=\"api-keys-section\" class=\"border border-gray-200 rounded-lg overflow-hidden\">\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "newKey")) {
output += "\n    <div class=\"bg-green-50 border-b border-green-200 p-4\">\n      <p class=\"text-sm font-semibold text-green-800 mb-1\">New key created — copy it now, it won't be shown again.</p>\n      <div class=\"flex items-center gap-2 mt-2\">\n        <code id=\"new-key-value\"\n              class=\"flex-1 bg-white border border-green-300 rounded px-3 py-2 text-sm font-mono text-green-900 break-all select-all\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "newKey"), env.opts.autoescape);
output += "</code>\n        <button type=\"button\"\n                onclick=\"navigator.clipboard.writeText(document.getElementById('new-key-value').textContent)\"\n                class=\"flex-shrink-0 text-xs bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-3 rounded transition-colors\">\n          Copy\n        </button>\n      </div>\n    </div>\n  ";
;
}
output += "\n\n  ";
if(env.getFilter("length").call(context, runtime.contextOrFrameLookup(context, frame, "apiKeys")) == 0) {
output += "\n    <div class=\"px-4 py-6 text-center text-sm text-gray-400\">No API keys yet.</div>\n  ";
;
}
else {
output += "\n    <ul class=\"divide-y divide-gray-100\">\n      ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "apiKeys");
if(t_3) {t_3 = runtime.fromIterator(t_3);
var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("key", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n        <li class=\"flex items-center justify-between px-4 py-3\">\n          <div>\n            <p class=\"text-sm font-medium text-gray-900\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"name"), env.opts.autoescape);
output += "</p>\n            <p class=\"text-xs text-gray-400 mt-0.5\">\n              Created ";
output += runtime.suppressValue(runtime.memberLookup((t_4),"created_at"), env.opts.autoescape);
output += "\n              ";
if(runtime.memberLookup((t_4),"last_used")) {
output += " &middot; Last used ";
output += runtime.suppressValue(runtime.memberLookup((t_4),"last_used"), env.opts.autoescape);
;
}
output += "\n            </p>\n          </div>\n          <form method=\"POST\" action=\"/settings/api-keys/";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id"), env.opts.autoescape);
output += "/revoke\"\n                hx-post=\"/settings/api-keys/";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id"), env.opts.autoescape);
output += "/revoke\"\n                hx-target=\"#api-keys-section\"\n                hx-swap=\"outerHTML\"\n                hx-confirm=\"Revoke '";
output += runtime.suppressValue(runtime.memberLookup((t_4),"name"), env.opts.autoescape);
output += "'? Any integrations using this key will stop working.\">\n            <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n            <button type=\"submit\"\n                    class=\"text-xs text-red-500 hover:text-red-700 font-medium transition-colors\">\n              Revoke\n            </button>\n          </form>\n        </li>\n      ";
;
}
}
frame = frame.pop();
output += "\n    </ul>\n  ";
;
}
output += "\n\n  <!-- Add new key -->\n  <div class=\"border-t border-gray-200 bg-gray-50 px-4 py-3\">\n    <form method=\"POST\" action=\"/settings/api-keys\"\n          hx-post=\"/settings/api-keys\"\n          hx-target=\"#api-keys-section\"\n          hx-swap=\"outerHTML\"\n          hx-on::after-request=\"this.reset()\">\n      <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n      <div class=\"flex gap-2\">\n        <input type=\"text\" name=\"name\" placeholder=\"Key name (e.g. Garmin sync)\"\n               required maxlength=\"80\"\n               class=\"flex-1 min-w-0 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\">\n        <button type=\"submit\"\n                class=\"flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors\">\n          Create\n        </button>\n      </div>\n    </form>\n  </div>\n\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/settings/dark-mode-toggle.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<div id=\"dark-mode-toggle\" class=\"flex items-center justify-between\">\n  <div>\n    <p class=\"text-sm font-medium text-gray-800\">Dark mode</p>\n    <p class=\"text-xs text-gray-500 mt-0.5\">Use a dark color scheme.</p>\n  </div>\n  <form method=\"POST\" action=\"/settings/dark-mode\"\n        hx-post=\"/settings/dark-mode\"\n        hx-target=\"#dark-mode-toggle\"\n        hx-swap=\"outerHTML\">\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n    <button type=\"submit\"\n            class=\"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "darkMode")?"bg-indigo-600":"bg-gray-200"), env.opts.autoescape);
output += "\"\n            role=\"switch\" aria-checked=\"";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "darkMode")?"true":"false"), env.opts.autoescape);
output += "\">\n      <span class=\"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "darkMode")?"translate-x-5":"translate-x-0"), env.opts.autoescape);
output += "\"></span>\n    </button>\n  </form>\n</div>\n<script>\n  document.documentElement.classList.toggle('dark', ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "darkMode")?"true":"false"), env.opts.autoescape);
output += ");\n</script>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/settings/logging-toggle.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<div id=\"logging-toggle\" class=\"flex items-center justify-between\">\n  <div>\n    <p class=\"text-sm font-medium text-gray-800\">Inline logging</p>\n    <p class=\"text-xs text-gray-500 mt-0.5\">Show set inputs on the home page to log while you train.</p>\n  </div>\n  <form method=\"POST\" action=\"/settings/logging\"\n        hx-post=\"/settings/logging\"\n        hx-target=\"#logging-toggle\"\n        hx-swap=\"outerHTML\">\n    <input type=\"hidden\" name=\"_csrf\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "csrfToken"), env.opts.autoescape);
output += "\">\n    <button type=\"submit\"\n            class=\"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "inlineLogging")?"bg-indigo-600":"bg-gray-200"), env.opts.autoescape);
output += "\"\n            role=\"switch\" aria-checked=\"";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "inlineLogging")?"true":"false"), env.opts.autoescape);
output += "\">\n      <span class=\"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "inlineLogging")?"translate-x-5":"translate-x-0"), env.opts.autoescape);
output += "\"></span>\n    </button>\n  </form>\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/workouts/detail.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-3\">\n  ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "workout")),"notes")) {
output += "\n    <p class=\"text-xs text-gray-500 italic\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "workout")),"notes"), env.opts.autoescape);
output += "</p>\n  ";
;
}
output += "\n\n  ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "groups");
if(t_3) {t_3 = runtime.fromIterator(t_3);
var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("group", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n    ";
if(runtime.memberLookup((t_4),"type") == "superset") {
output += "\n      <div class=\"border border-indigo-100 rounded-lg overflow-hidden\">\n        <div class=\"bg-indigo-50 px-3 py-1.5\">\n          <span class=\"text-xs font-semibold text-indigo-600 uppercase tracking-wide\">Superset</span>\n        </div>\n        ";
frame = frame.push();
var t_7 = runtime.memberLookup((t_4),"lifts");
if(t_7) {t_7 = runtime.fromIterator(t_7);
var t_6 = t_7.length;
for(var t_5=0; t_5 < t_7.length; t_5++) {
var t_8 = t_7[t_5];
frame.set("lift", t_8);
frame.set("loop.index", t_5 + 1);
frame.set("loop.index0", t_5);
frame.set("loop.revindex", t_6 - t_5);
frame.set("loop.revindex0", t_6 - t_5 - 1);
frame.set("loop.first", t_5 === 0);
frame.set("loop.last", t_5 === t_6 - 1);
frame.set("loop.length", t_6);
output += "\n          <div class=\"px-3 py-2 ";
if(!runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"last")) {
output += "border-b border-indigo-100";
;
}
output += "\">\n            <p class=\"text-xs font-semibold text-gray-700 mb-1 capitalize\">";
output += runtime.suppressValue(runtime.memberLookup((t_8),"lift_name"), env.opts.autoescape);
output += "</p>\n            <div class=\"space-y-0.5\">\n              ";
frame = frame.push();
var t_11 = runtime.memberLookup((t_8),"sets");
if(t_11) {t_11 = runtime.fromIterator(t_11);
var t_10 = t_11.length;
for(var t_9=0; t_9 < t_11.length; t_9++) {
var t_12 = t_11[t_9];
frame.set("set", t_12);
frame.set("loop.index", t_9 + 1);
frame.set("loop.index0", t_9);
frame.set("loop.revindex", t_10 - t_9);
frame.set("loop.revindex0", t_10 - t_9 - 1);
frame.set("loop.first", t_9 === 0);
frame.set("loop.last", t_9 === t_10 - 1);
frame.set("loop.length", t_10);
output += "\n                <p class=\"text-xs text-gray-600\">\n                  Set ";
output += runtime.suppressValue(runtime.memberLookup((t_12),"set_number"), env.opts.autoescape);
output += ": ";
output += runtime.suppressValue(runtime.memberLookup((t_12),"reps"), env.opts.autoescape);
output += " reps &times; ";
output += runtime.suppressValue(runtime.memberLookup((t_12),"weight"), env.opts.autoescape);
output += " lbs\n                </p>\n              ";
;
}
}
frame = frame.pop();
output += "\n            </div>\n          </div>\n        ";
;
}
}
frame = frame.pop();
output += "\n      </div>\n    ";
;
}
else {
output += "\n      ";
var t_13;
t_13 = runtime.memberLookup((runtime.memberLookup((t_4),"lifts")),0);
frame.set("lift", t_13, true);
if(frame.topLevel) {
context.setVariable("lift", t_13);
}
if(frame.topLevel) {
context.addExport("lift", t_13);
}
output += "\n      <div>\n        <p class=\"text-xs font-semibold text-gray-700 mb-1 capitalize\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "lift")),"lift_name"), env.opts.autoescape);
output += "</p>\n        <div class=\"space-y-0.5\">\n          ";
frame = frame.push();
var t_16 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "lift")),"sets");
if(t_16) {t_16 = runtime.fromIterator(t_16);
var t_15 = t_16.length;
for(var t_14=0; t_14 < t_16.length; t_14++) {
var t_17 = t_16[t_14];
frame.set("set", t_17);
frame.set("loop.index", t_14 + 1);
frame.set("loop.index0", t_14);
frame.set("loop.revindex", t_15 - t_14);
frame.set("loop.revindex0", t_15 - t_14 - 1);
frame.set("loop.first", t_14 === 0);
frame.set("loop.last", t_14 === t_15 - 1);
frame.set("loop.length", t_15);
output += "\n            <p class=\"text-xs text-gray-600\">\n              Set ";
output += runtime.suppressValue(runtime.memberLookup((t_17),"set_number"), env.opts.autoescape);
output += ": ";
output += runtime.suppressValue(runtime.memberLookup((t_17),"reps"), env.opts.autoescape);
output += " reps &times; ";
output += runtime.suppressValue(runtime.memberLookup((t_17),"weight"), env.opts.autoescape);
output += " lbs\n            </p>\n          ";
;
}
}
frame = frame.pop();
output += "\n        </div>\n      </div>\n    ";
;
}
output += "\n  ";
;
}
}
frame = frame.pop();
output += "\n\n  <div class=\"pt-1\">\n    <button type=\"button\"\n            onclick=\"document.getElementById('detail-";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "workout")),"id"), env.opts.autoescape);
output += "').innerHTML=''\"\n            class=\"text-xs text-gray-400 hover:text-gray-600\">\n      &uarr; Collapse\n    </button>\n  </div>\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })(),
  "partials/workouts/list-items.njk": (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "workouts");
if(t_3) {t_3 = runtime.fromIterator(t_3);
var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("workout", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n<div class=\"border border-gray-200 rounded-lg overflow-hidden bg-white\">\n  <div class=\"px-4 py-3 flex items-start justify-between gap-3\">\n    <div class=\"min-w-0 flex-1\">\n      <p class=\"font-medium text-gray-900 text-sm\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"formatted_date"), env.opts.autoescape);
output += "</p>\n      <p class=\"text-xs text-gray-500 mt-0.5 truncate\">\n        ";
if(runtime.memberLookup((t_4),"lift_names")) {
output += runtime.suppressValue(runtime.memberLookup((t_4),"lift_names"), env.opts.autoescape);
;
}
else {
output += "<span class=\"italic\">No lifts</span>";
;
}
output += "\n      </p>\n      <p class=\"text-xs text-gray-400 mt-0.5\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"total_sets"), env.opts.autoescape);
output += " set";
output += runtime.suppressValue((runtime.memberLookup((t_4),"total_sets") != 1?"s":""), env.opts.autoescape);
output += "</p>\n    </div>\n    <div class=\"flex items-center gap-2 flex-shrink-0\">\n      <a href=\"/workouts/";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id"), env.opts.autoescape);
output += "/edit\"\n         class=\"text-xs text-indigo-600 hover:text-indigo-800 font-medium\">Edit</a>\n      <button type=\"button\"\n              hx-get=\"/workouts/";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id"), env.opts.autoescape);
output += "/detail\"\n              hx-target=\"#detail-";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id"), env.opts.autoescape);
output += "\"\n              hx-swap=\"innerHTML\"\n              hx-indicator=\"#spinner-";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id"), env.opts.autoescape);
output += "\"\n              class=\"text-xs text-gray-500 hover:text-gray-700 font-medium border border-gray-200 rounded px-2 py-1\">\n        Details\n        <span id=\"spinner-";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id"), env.opts.autoescape);
output += "\" class=\"htmx-indicator text-gray-400 ml-1\">…</span>\n      </button>\n    </div>\n  </div>\n  <div id=\"detail-";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id"), env.opts.autoescape);
output += "\"></div>\n</div>\n";
;
}
}
if (!t_2) {
output += "\n<p class=\"text-center text-sm text-gray-400 py-10\">No workouts logged yet.</p>\n";
}
frame = frame.pop();
output += "\n\n";
if(runtime.contextOrFrameLookup(context, frame, "nextCursor")) {
output += "\n<div hx-get=\"/workouts?cursor=";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "nextCursor"), env.opts.autoescape);
output += "\"\n     hx-target=\"this\"\n     hx-swap=\"outerHTML\"\n     hx-trigger=\"click\"\n     class=\"w-full text-center py-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors\">\n  Load more\n</div>\n";
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

  })()
};
