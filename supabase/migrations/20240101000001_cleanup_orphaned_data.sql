-- Function to clean up orphaned data (rows referencing non-existent users)
create or replace function cleanup_orphaned_data()
returns void
language plpgsql
security definer
as $$
begin
  -- Clean up orphaned conversations and their messages
  delete from public.messages
  where conversation_id in (
    select c.id 
    from public.conversations c
    left join auth.users u on c.user_id = u.id
    where u.id is null
  );
  
  delete from public.conversations c
  where not exists (
    select 1 from auth.users u 
    where u.id = c.user_id
  );
  
  -- Add more cleanup for other tables as needed
  -- Example:
  -- delete from public.another_table t
  -- where not exists (
  --   select 1 from auth.users u 
  --   where u.id = t.user_id
  -- );
  
  -- Log the cleanup
  raise notice 'Orphaned data cleanup completed';
  
  return;
end;
$$;

-- Grant execute permission to authenticated users
revoke all on function cleanup_orphaned_data() from public;
grant execute on function cleanup_orphaned_data() to authenticated;

-- Create a trigger function to automatically clean up when a user is deleted
create or replace function handle_user_deleted()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Call the cleanup function when a user is deleted
  perform cleanup_orphaned_data();
  return old;
end;
$$;

-- Create a trigger to call the function after a user is deleted
create or replace trigger after_user_deleted
after delete on auth.users
for each row
execute function handle_user_deleted();
