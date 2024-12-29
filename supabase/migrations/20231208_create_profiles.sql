-- Create profiles table
create table profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  email text unique not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Set up automatic updated_at
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on profiles
  for each row execute procedure moddatetime (updated_at);
