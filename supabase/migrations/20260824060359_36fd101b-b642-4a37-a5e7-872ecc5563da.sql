-- Redacted: this migration previously set a hardcoded admin password in plaintext.
-- Credentials must never be committed; the admin password has since been rotated
-- out-of-band via the password-reset flow. Kept as a no-op to preserve history.
create extension if not exists pgcrypto with schema extensions;
