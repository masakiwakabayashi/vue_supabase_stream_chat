import { supabase } from "@/lib/supabaseClient";

export async function savePost(text: string): Promise<void> {
  const embedding = await getEmbedding(text);

  console.log(text);

  // TODO: これが404のエラーになっている
  const response = await fetch('http://localhost:54321/functions/v1/save-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
    },
    body: JSON.stringify({
      content: text,
      embedding: embedding,
    }),
  });

  // Edge FunctionのレスポンスがJSONでない場合に備えてガード
  let json: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    json = await response.json();
  }

  console.log(response);

  if (!response.ok) {
    const errorMsg = json && json.error ? json.error : '保存に失敗しました';
    console.error('Edge Function Error:', errorMsg);
    throw new Error(errorMsg);
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
