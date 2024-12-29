-- First, let's check if there's any existing data
do $$ 
declare
  entry_count integer;
begin
  select count(*) into entry_count from diary_entries;
  
  if entry_count > 0 then
    -- If there's existing data, we should either:
    -- 1. Delete the existing entries (since they don't have a user)
    -- 2. Or assign them to a default user
    
    -- Option 1: Delete existing entries
    delete from diary_entries;
  end if;
end $$;

-- Now add user_id column
alter table diary_entries
add column user_id uuid references auth.users(id);

-- Set user_id to be not null after adding it
alter table diary_entries
alter column user_id set not null;

-- Rename last_opened_at to updated_at if it exists
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'diary_entries'
    and column_name = 'last_opened_at'
  ) then
    alter table diary_entries
    rename column last_opened_at to updated_at;
  end if;
end $$;

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
