-- Add user_id column
alter table diary_entries
add column user_id uuid references auth.users(id);

-- Set user_id to be not null after adding it
alter table diary_entries
alter column user_id set not null;

-- Rename last_opened_at to updated_at
alter table diary_entries
rename column last_opened_at to updated_at;

-- Enable RLS
alter table diary_entries enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own entries" on diary_entries;
drop policy if exists "Users can create their own entries" on diary_entries;
drop policy if exists "Users can update their own entries" on diary_entries;
drop policy if exists "Users can delete their own entries" on diary_entries;

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
create index if not exists diary_entries_user_id_idx on diary_entries(user_id);
create index if not exists diary_entries_date_idx on diary_entries(date);
