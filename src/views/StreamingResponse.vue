<script setup>
import { ref } from 'vue';
import { fetchChatStream } from '@/repositories/ChatRepository';

const isLoading = ref(false);
const message = ref('');
const userInput = ref('');
const chatMessages = ref([]);
const userInputs = ref([]);

async function startChat() {
  if (!userInput.value.trim()) return;

  message.value = '';
  isLoading.value = true;

  const messages = [
    { role: 'system', content: 'あなたは親切なアシスタントです。' },
    { role: 'user', content: userInput.value },
  ];

  let answer = '';
  try {
    // コールバック関数で少しづつ渡されるテキストをanswerに追加していく
    await fetchChatStream(messages, (text) => {
      answer += text;
      message.value += text;
    });
    // streamingが完了したらchatMessagesにpush
    chatMessages.value.push(answer);
    // 回答を入れる変数を初期化
    message.value = '';
  } catch (e) {
    message.value = 'エラーが発生しました: ' + (e instanceof Error ? e.message : String(e));
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="p-4 max-w-xl mx-auto">
    <!-- TODO: ここにユーザーの入力とAIからの回答を交互に表示していく -->
    <div class="p-4">
      <ul class="space-y-2">
        <li v-for="(message, index) in chatMessages" :key="index" class="py-3 rounded whitespace-pre-wrap">
          {{ message }}
        </li>
      </ul>
    </div>

    <!-- チャット応答表示 -->
    <div class="whitespace-pre-wrap rounded min-h-[100px]">
      {{ message }}
    </div>

    <!-- 入力エリア -->
    <textarea
      v-model="userInput"
      rows="4"
      placeholder="メッセージを入力..."
      class="w-full p-2 border rounded resize-none"
    />

    <!-- 送信ボタン -->
    <button
      @click="startChat"
      :disabled="isLoading || !userInput.trim()"
      class="mt-4 p-2 bg-blue-500 text-white rounded w-full"
    >
      {{ isLoading ? '送信中...' : 'チャット送信' }}
    </button>
  </div>
</template>
