-- Drop existing policies
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;

-- Enable RLS
alter table profiles enable row level security;

-- Create more permissive policies for profile creation during signup
create policy "Profiles are viewable by users who created them"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can create their own profile"
  on profiles for insert
  with check (auth.uid() = id OR auth.uid() IS NOT NULL);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Grant necessary permissions to authenticated users
grant usage on schema public to authenticated;
grant all on profiles to authenticated;

-- If using triggers, grant execute permission
grant execute on all functions in schema public to authenticated;
