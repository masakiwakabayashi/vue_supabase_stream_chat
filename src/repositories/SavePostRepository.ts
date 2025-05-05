import { supabase } from "@/lib/supabaseClient";

export async function savePost(text: string): Promise<void> {
  const embedding = await getEmbedding(text);

  console.log(text);

  const response = await fetch('/functions/v1/save-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      content: text,
      embedding: embedding,
    }),
  });

  // TODO: ここでエラーが出ている
  const json = await response.json();

  console.log(response);

  if (!response.ok) {
    console.error('Edge Function Error:', json.error);
    throw new Error(json.error || '保存に失敗しました');
  }

  console.log('保存成功:', json);
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
