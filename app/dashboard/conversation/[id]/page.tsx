"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { VideoChat } from "@/components/video-chat";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ConversationSkeleton } from "@/components/conversation-skeleton";

export default function ConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversation() {
      setLoading(true);
      const { data, error } = await supabase
        .from("conversations")
        .select("id, youtube_url, transcription, chat")
        .eq("id", params.id)
        .single();
      if (error || !data) {
        setError("Conversation not found.");
      } else {
        setConversation(data);
      }
      setLoading(false);
    }
    fetchConversation();
  }, [params.id]);

  return (
    <DashboardLayout>
      {loading ? (
        <ConversationSkeleton />
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : !conversation ? null : (
        <div className="max-w-4xl mx-auto mt-8">
          <VideoChat
            videoUrl={conversation.youtube_url}
            transcript={conversation.transcription}
            // Optionally pass chat and id as props if VideoChat supports it
            onBack={() => router.push("/dashboard")}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
