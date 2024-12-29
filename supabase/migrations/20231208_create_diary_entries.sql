-- Create diary_entries table
create table diary_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  content text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  mood text,
  tags text[] default array[]::text[],
  images text[] default array[]::text[],
  videos text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table diary_entries enable row level security;

-- Create policies
create policy "Users can view their own entries"
  on diary_entries for select
  using (auth.uid() = user_id);

create policy "Users can create their own entries"
  on diary_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on diary_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on diary_entries for delete
  using (auth.uid() = user_id);

-- Create indexes
create index diary_entries_user_id_idx on diary_entries(user_id);
create index diary_entries_date_idx on diary_entries(date);

-- Set up automatic updated_at
create trigger handle_diary_updated_at before update on diary_entries
  for each row execute procedure moddatetime (updated_at);
