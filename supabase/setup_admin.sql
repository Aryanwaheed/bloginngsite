-- Run this script in your Supabase SQL Editor to create the admin user

-- Enable the pgcrypto extension if it's not already enabled (required for hashing passwords)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  admin_email TEXT := 'aryanwaheednew@gmail.com';
  admin_password TEXT := 'Admin123###';
BEGIN
  -- Check if the user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    
    -- Insert into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      current_timestamp,
      current_timestamp,
      current_timestamp,
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin"}',
      current_timestamp,
      current_timestamp,
      '',
      '',
      '',
      ''
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      new_user_id::text,
      new_user_id,
      format('{"sub":"%s","email":"%s"}', new_user_id::text, admin_email)::jsonb,
      'email',
      current_timestamp,
      current_timestamp,
      current_timestamp
    );

    RAISE NOTICE 'Admin user created successfully.';
  ELSE
    -- If user already exists, update the password to ensure they can log in
    UPDATE auth.users 
    SET encrypted_password = crypt(admin_password, gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, current_timestamp)
    WHERE email = admin_email;

    RAISE NOTICE 'Admin user already exists. Password updated.';
  END IF;
END $$;
