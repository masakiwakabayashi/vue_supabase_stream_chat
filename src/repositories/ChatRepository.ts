type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function fetchChatStream(
  messages: ChatMessage[],
  onMessageCallback: (text: string) => void
) {
  const apiKey = import.meta.env.VITE_OPEN_AI_API_KEY;

  // これでストリーミング形式で表示できる回答のレスポンスを取得する
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      messages,
      stream: true,
    }),
  });

  if (!response.body) {
    throw new Error('Stream not supported');
  }

  const reader = response.body.getReader();
  // バイナリを文字列に変換するためTextDecoderを使う
  const decoder = new TextDecoder('utf-8');

  let done = false;
  while (!done) {
    // reader.read()でレスポンスを少しづつ読み取る
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    // ↓ これ以降の処理でOpenAIのストリーミングレスポンスを回答の文字列に変換していく
    if (value) {
      // ここでバイナリを文字列に変換する
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          // dataはjson形式のテキストデータ
          const data = line.replace(/^data: /, '');
          // OpenAIのストリーミングレスポンス最後はdataが[DONE]になる
          if (data === '[DONE]') return;
          try {
            // json形式のテキストをオブジェクトに変換する
            const parsed = JSON.parse(data) as {
              choices: {
                delta?: {
                  content?: string;
                };
              }[];
            };
            // parsed.choices[0]?.delta?.contentが少しづつの文字のかたまりになっている
            const text = parsed.choices[0]?.delta?.content;
            if (text) {
              // コールバック関数でコンポーネントにテキストを送る
              onMessageCallback(text);
            }
          } catch (e) {
            console.error('JSON parse error', e);
          }
        }
      }
    }
  }
}
