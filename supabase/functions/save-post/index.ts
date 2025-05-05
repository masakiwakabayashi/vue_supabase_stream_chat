import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

serve(async (req: Request) => {
  const { content, embedding } = await req.json();

  console.log("これがcontent");
  console.log(content);
  console.log("これがembedding.length");
  console.log(embedding.length);

  if (!content || !Array.isArray(embedding) || embedding.length !== 1536) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
  }

  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await client.rpc("insert_post_with_embedding", {
    p_content: content,
    p_embedding: embedding,
  });

  if (error) {
    console.error("RPC Error:", error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});

