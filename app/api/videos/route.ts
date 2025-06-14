import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

// POST /api/videos
export async function POST(req: NextRequest) {
  const { youtube_title, youtube_url, transcription, chat, access_token } = await req.json();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Create a Supabase client with the user's access token
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${access_token}` } }
  });

  // Get user info
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Insert into conversations
  const { error } = await supabase.from('conversations').insert([
    {
      youtube_title,
      youtube_url,
      transcription,
      chat
    }
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
