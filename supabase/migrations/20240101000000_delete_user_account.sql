-- Function to delete user account and all associated data including conversations
create or replace function delete_user_account()
returns void
language plpgsql
security definer
as $$
declare
  user_uuid uuid := auth.uid();
begin
  -- First, delete messages in conversations
  delete from public.messages 
  where conversation_id in (
    select id from public.conversations where user_id = user_uuid
  );
  
  -- Then delete the conversations
  delete from public.conversations 
  where user_id = user_uuid;
  
  -- Next, delete any other user-specific data
  -- Add more DELETE statements for other user-related tables as needed
  -- Example:
  -- delete from public.user_notes where user_id = user_uuid;
  
  -- Finally, delete the user (this will handle any remaining auth-related data)
  delete from auth.users where id = user_uuid;
  
  -- Return success
  return;
end;
$$;

-- Grant execute permission to authenticated users
revoke all on function delete_user_account() from public;
grant execute on function delete_user_account() to authenticated;
