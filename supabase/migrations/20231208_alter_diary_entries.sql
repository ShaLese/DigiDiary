-- First, let's check if we need to add the user_id column
do $$ 
begin
  if not exists (select 1 from information_schema.columns 
                 where table_name = 'diary_entries' and column_name = 'user_id') then
    alter table diary_entries 
    add column user_id uuid references auth.users(id) not null;
  end if;
end $$;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own entries" on diary_entries;
drop policy if exists "Users can create their own entries" on diary_entries;
drop policy if exists "Users can update their own entries" on diary_entries;
drop policy if exists "Users can delete their own entries" on diary_entries;

-- Ensure RLS is enabled
alter table diary_entries enable row level security;

-- Create or update policies
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

-- Create indexes if they don't exist
create index if not exists diary_entries_user_id_idx on diary_entries(user_id);
create index if not exists diary_entries_date_idx on diary_entries(date);

-- Ensure moddatetime extension exists
create extension if not exists moddatetime schema extensions;

-- Drop existing trigger if it exists
drop trigger if exists handle_diary_updated_at on diary_entries;

-- Create trigger for updated_at
create trigger handle_diary_updated_at before update on diary_entries
  for each row execute procedure moddatetime (updated_at);
