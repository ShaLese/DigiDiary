-- Enable Row Level Security
alter table diary_entries enable row level security;

-- Create a policy that allows users to only see their own entries
create policy "Users can only view their own entries"
  on diary_entries
  for select
  using (auth.uid() = user_id);

-- Create a policy that allows users to insert their own entries
create policy "Users can insert their own entries"
  on diary_entries
  for insert
  with check (auth.uid() = user_id);

-- Create a policy that allows users to update their own entries
create policy "Users can update their own entries"
  on diary_entries
  for update
  using (auth.uid() = user_id);

-- Create a policy that allows users to delete their own entries
create policy "Users can delete their own entries"
  on diary_entries
  for delete
  using (auth.uid() = user_id);

-- Add user_id column to diary_entries table
alter table diary_entries
  add column user_id uuid references auth.users(id)
  not null default auth.uid();
