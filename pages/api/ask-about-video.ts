import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';
import OpenAI from 'openai';

// Maximum tokens for the model's context window (leaving room for the question and response)
const MAX_CONTEXT_TOKENS = 12000;
// Estimate tokens per word (conservative estimate)
const TOKENS_PER_WORD = 1.5;
// Maximum words per chunk
const MAX_WORDS_PER_CHUNK = Math.floor(MAX_CONTEXT_TOKENS / TOKENS_PER_WORD) * 0.8; // 80% of max to be safe

// Helper function to split text into chunks by sentences
function splitIntoSentences(text: string): string[] {
  // Split by sentence endings, preserving the delimiters
  const sentenceRegex = /[.!?]+\s*/g;
  const sentences = [];
  let match;
  let lastIndex = 0;
  
  while ((match = sentenceRegex.exec(text)) !== null) {
    const sentence = text.slice(lastIndex, match.index + match[0].length).trim();
    if (sentence) sentences.push(sentence);
    lastIndex = match.index + match[0].length;
  }
  
  // Add the last sentence if there's any text left
  const remaining = text.slice(lastIndex).trim();
  if (remaining) sentences.push(remaining);
  
  return sentences;
}

// Function to chunk text into smaller pieces
function chunkText(text: string, maxWords: number): string[] {
  const sentences = splitIntoSentences(text);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    const sentenceWordCount = words.length;
    
    if (currentWordCount + sentenceWordCount > maxWords && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [];
      currentWordCount = 0;
    }
    
    currentChunk.push(sentence);
    currentWordCount += sentenceWordCount;
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }
  
  return chunks;
}

// Function to summarize text using OpenAI
async function summarizeText(text: string, openai: OpenAI): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes text concisely while preserving key information.'
        },
        {
          role: 'user',
          content: `Please summarize the following text concisely while preserving all key information and details that might be relevant for answering questions:\n\n${text}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });
    
    return response.choices[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error('Error in summarization:', error);
    // If summarization fails, return the original text
    return text;
  }
}

// Function to process large text by chunking and summarizing if needed
async function processLargeText(text: string, openai: OpenAI): Promise<string> {
  // Estimate token count (roughly)
  const wordCount = text.split(/\s+/).length;
  const estimatedTokens = Math.ceil(wordCount * TOKENS_PER_WORD);
  
  if (estimatedTokens <= MAX_CONTEXT_TOKENS) {
    return text; // No need to process
  }
  
  console.log(`Processing large text (${wordCount} words, ~${estimatedTokens} tokens)`);
  
  // Split into chunks and summarize each chunk
  const chunks = chunkText(text, MAX_WORDS_PER_CHUNK);
  console.log(`Split into ${chunks.length} chunks`);
  
  const summarizedChunks = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Summarizing chunk ${i + 1}/${chunks.length}`);
    const summary = await summarizeText(chunks[i], openai);
    summarizedChunks.push(summary);
  }
  
  // Combine the summarized chunks
  const combinedSummary = summarizedChunks.join('\n\n');
  
  // If the combined summary is still too large, recursively summarize it
  if (combinedSummary.length > MAX_CONTEXT_TOKENS * 4) { // Rough character count check
    return await processLargeText(combinedSummary, openai);
  }
  
  return combinedSummary;
}

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
    // Process the transcription to handle large inputs
    const processedTranscription = await processLargeText(transcription, openai);
    
    // Create a more efficient prompt
    const messages = [
      {
        role: 'system' as const,
        content: 'You are an expert assistant. Use the video transcription to answer the user\'s question clearly and accurately. If the answer is not in the transcription, say so.'
      },
      {
        role: 'user' as const,
        content: `Question: ${question}\n\nVideo transcription:\n${processedTranscription}`
      }
    ];
    
    // Use exponential backoff for rate limiting
    let retries = 3;
    let lastError;
    let answer = 'Sorry, I could not generate an answer.';
    
    while (retries > 0) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 1000,
          temperature: 0.3,
        });
        
        answer = completion.choices[0]?.message?.content?.trim() || answer;
        break; // Success, exit retry loop
      } catch (error: any) {
        lastError = error;
        if (error.status === 429) {
          // Rate limited, wait and retry
          const waitTime = Math.pow(2, 4 - retries) * 1000;
          console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retries--;
        } else {
          console.error('OpenAI API error:', error);
          throw error;
        }
      }
    }
    
    if (retries === 0 && lastError) {
      console.error('Failed after multiple retries:', lastError);
      throw lastError;
    }

    // Append this Q&A to chat and update conversation
    const newChatEntry = { 
      question, 
      answer, 
      timestamp: new Date().toISOString() 
    };
    
    const updatedChat = Array.isArray(chat) ? [...chat, newChatEntry] : [newChatEntry];
    
    // Update the conversation in the database
    const { error: chatUpdateError, data: chatUpdateData } = await supabase
      .from('conversations')
      .update({ chat: updatedChat })
      .eq('id', conversationId)
      .select();
      
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
    console.error('Error in ask-about-video:', err);
    return res.status(500).json({ 
      error: 'Failed to process your request.',
      details: err.message 
    });
  }
}
