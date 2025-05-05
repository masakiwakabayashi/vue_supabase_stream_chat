import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

// CORS用ヘッダー（共通で使う）
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// エントリーポイント
serve(async (req: Request) => {
  // 事前リクエスト（preflight）への対応
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { content, embedding } = await req.json();

    console.log("これがcontent");
    console.log(content);
    console.log("これがembedding.length");
    console.log(embedding.length);

    if (!content || !Array.isArray(embedding) || embedding.length !== 1536) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const client = createClient(
      Deno.env.get("VITE_SUPABASE_URL")!,
      Deno.env.get("VITE_SUPABASE_KEY")!
    );

    const { error } = await client.rpc("insert_post_with_embedding", {
      p_content: content,
      p_embedding: embedding,
    });

    if (error) {
      console.error("RPC Error:", error);
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    console.error("JSON parse or unknown error", e);
    return new Response(JSON.stringify({ error: "Invalid JSON or server error" }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
