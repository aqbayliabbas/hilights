-- Add ON DELETE CASCADE to the conversations table's user_id foreign key
-- First, drop existing foreign key constraint (you'll need to know its name)
DO $$
BEGIN
  -- Try to drop the existing constraint if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_name = 'conversations' 
    AND constraint_name = 'conversations_user_id_fkey'
  ) THEN
    EXECUTE 'ALTER TABLE public.conversations DROP CONSTRAINT conversations_user_id_fkey';
  END IF;
  
  -- Add the new constraint with CASCADE
  EXECUTE 'ALTER TABLE public.conversations 
    ADD CONSTRAINT conversations_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE';
    
  RAISE NOTICE 'Added CASCADE delete to conversations_user_id_fkey';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error modifying constraints: %', SQLERRM;
END $$;

-- Add similar CASCADE for messages table if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_name = 'messages' 
    AND constraint_name = 'messages_conversation_id_fkey'
  ) THEN
    EXECUTE 'ALTER TABLE public.messages DROP CONSTRAINT messages_conversation_id_fkey';
    
    EXECUTE 'ALTER TABLE public.messages 
      ADD CONSTRAINT messages_conversation_id_fkey 
      FOREIGN KEY (conversation_id) 
      REFERENCES public.conversations(id) 
      ON DELETE CASCADE';
      
    RAISE NOTICE 'Added CASCADE delete to messages_conversation_id_fkey';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error modifying message constraints: %', SQLERRM;
END $$;
