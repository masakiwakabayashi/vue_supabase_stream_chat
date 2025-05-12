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
    const { query_embedding, match_threshold, match_count } = await req.json();

    if (
      !Array.isArray(query_embedding) ||
      typeof match_threshold !== "number" ||
      typeof match_count !== "number"
    ) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await client.rpc("search_similar_posts", {
      query_embedding,
      match_threshold,
      match_count,
    });

    if (error) {
      console.error("RPC Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(data), {
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
