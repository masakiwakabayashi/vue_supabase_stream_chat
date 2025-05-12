import { getEmbedding } from "@/utils/getEmbedding"
import { supabase } from "@/lib/supabaseClient"

export async function getAnswerFromQuestion(question: string): Promise<string> {
  const embedding = await getEmbedding(question)
  const similar = await searchSimilarContent(embedding)
  const prompt = buildPrompt(question, similar)
  return await askChatGPT(prompt)
}

async function searchSimilarContent(embedding: number[]) {
  // supabaseKeyを取得
  // @ts-ignore
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  const response = await fetch('http://localhost:54321/functions/v1/search-similar-posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      query_embedding: embedding,
      match_threshold: 0.75,
      match_count: 5
    })
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || '検索中にエラーが発生しました')
  }

  return result
}

function buildPrompt(question: string, similarContents: any[]): string {
  const context = similarContents.map((item, i) => `${i + 1}. ${item.content}`).join('\n')
  return `以下の情報を参考にして質問に答えてください。\n\n${context}\n\n質問: ${question}`
}

async function askChatGPT(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await response.json()
  return data.choices[0].message.content
}
