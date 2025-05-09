import { supabase } from "@/lib/supabaseClient";
import { getEmbedding } from "@/utils/getEmbedding";

export async function savePost(text: string): Promise<void> {
  const embedding = await getEmbedding(text);

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

  if (!response.ok) {
    const errorMsg = json && json.error ? json.error : '保存に失敗しました';
    console.error('Edge Function Error:', errorMsg);
    throw new Error(errorMsg);
  }

  console.log('保存成功:', json);
}
