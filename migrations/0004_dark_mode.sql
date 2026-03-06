-- Migration: 0004_dark_mode
-- Add dark_mode preference to user_settings
ALTER TABLE user_settings ADD COLUMN dark_mode INTEGER NOT NULL DEFAULT 0;
