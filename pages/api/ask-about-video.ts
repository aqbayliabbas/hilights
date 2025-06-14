import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Only POST is supported.' });
  }

  const { question, videoId } = req.body;
  if (!question || !videoId) {
    return res.status(400).json({ error: 'Missing question or videoId.' });
  }

  // Helper to check if a string is a valid UUID v4
  function isUUID(str: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
  }

  let conversationData = null;
  let transcription = null;
  let chat = [];
  let conversationId = null;

  if (isUUID(videoId)) {
    // Query by UUID
    let { data, error } = await supabase
      .from('conversations')
      .select('id, transcription, chat, youtube_url')
      .eq('id', videoId)
      .single();
    if (data) {
      conversationData = data;
      transcription = data.transcription;
      chat = data.chat || [];
      conversationId = data.id;
    }
  } else {
    // Query by YouTube URL or video ID
    let { data, error } = await supabase
      .from('conversations')
      .select('id, transcription, chat, youtube_url')
      .or(`youtube_url.eq.${videoId},youtube_url.ilike.%${videoId}%`)
      .single();
    if (data) {
      conversationData = data;
      transcription = data.transcription;
      chat = data.chat || [];
      conversationId = data.id;
    }
  }

  if (!conversationData) {
    console.error('Conversation not found for videoId:', videoId);
    return res.status(404).json({ error: 'Conversation not found' });
  }

  // If not found, fetch from /api/transcribe and store in Supabase
  if (!transcription) {
    // For this call, we assume the client provides the videoUrl (if needed)
    const videoUrl = req.body.videoUrl;
    if (!videoUrl) {
      console.error('louenes: Missing videoUrl to fetch transcription.');
      return res.status(400).json({ error: 'Missing videoUrl to fetch transcription.' });
    }
    // Fetch from /api/transcribe
    const params = new URLSearchParams({ url: videoUrl, text: 'true' });
    try {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host;
      const absoluteUrl = `${protocol}://${host}/api/transcribe?${params.toString()}`;
      const transcribeRes = await fetch(absoluteUrl);
      const transcribeData = await transcribeRes.json();
      if (!transcribeRes.ok || !transcribeData.content) {
        console.error('louenes: Failed to fetch transcription.', transcribeData);
        return res.status(404).json({ error: 'Failed to fetch transcription.' });
      }
      transcription = transcribeData.content;

      // Store in Supabase for future use
      await supabase.from('conversations').update({ transcription }).eq('id', videoId);
    } catch (louenes) {
      console.error('louenes:', louenes);
      return res.status(500).json({ error: 'Error fetching transcription.' });
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert assistant. Use the following video transcription to answer the user\'s question as clearly and accurately as possible.'
        },
        {
          role: 'user',
          content: `Video transcription: ${transcription}\n\nUser question: ${question}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    const answer = completion.choices[0]?.message?.content || 'Sorry, I could not generate an answer.';

    // Append this Q&A to chat and update conversation
    const newChatEntry = { question, answer, timestamp: new Date().toISOString() };
    const updatedChat = Array.isArray(chat) ? [...chat, newChatEntry] : [newChatEntry];
    const { error: chatUpdateError, data: chatUpdateData } = await supabase.from('conversations').update({ chat: updatedChat }).eq('id', conversationId).select();
    if (chatUpdateError) {
      console.error('Failed to update chat:', chatUpdateError);
      return res.status(500).json({ error: 'Failed to update chat', details: chatUpdateError.message });
    }
    if (!chatUpdateData || chatUpdateData.length === 0) {
      console.error('Conversation not found for chat update, id:', conversationId);
      return res.status(404).json({ error: 'Conversation not found for chat update' });
    }

    return res.status(200).json({ answer, chat: updatedChat });
  } catch (err: any) {
    console.error('OpenAI error:', err);
    return res.status(500).json({ error: 'Failed to get answer from OpenAI.' });
  }
}
