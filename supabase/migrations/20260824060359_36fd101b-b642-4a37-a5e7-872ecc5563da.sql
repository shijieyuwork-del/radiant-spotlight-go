create extension if not exists pgcrypto with schema extensions;

update auth.users
set encrypted_password = extensions.crypt('AdminDev@2026', extensions.gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now()),
    updated_at = now()
where lower(email) = 'shijieyuwork@gmail.com';