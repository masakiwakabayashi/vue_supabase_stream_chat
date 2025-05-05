// repositories/documentRepository.ts
import { supabase } from "@/lib/supabaseClient";

export async function savePost(text: string): Promise<void> {
  const embedding = await getEmbedding(text);

  const { data, error } = await supabase
    .from('posts')
    .insert({
      content: text,
      embedding,
    });

  if (error) throw error;

  console.log(data);
}

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
    }),
  });

  const json = await response.json();
  return json.data[0].embedding;
}
