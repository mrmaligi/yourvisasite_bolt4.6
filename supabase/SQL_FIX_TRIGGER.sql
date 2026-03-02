-- Fixes the handle_new_user trigger which crashes during user signup
-- due to a type casting error resulting from dropped 'public.user_role' enum type.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', ''),
    CASE
      WHEN (NEW.raw_user_meta_data ->> 'role')::text = 'lawyer' THEN 'lawyer'
      WHEN (NEW.raw_user_meta_data ->> 'role')::text = 'admin' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
