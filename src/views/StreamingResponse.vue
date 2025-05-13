<script setup>
import { ref } from 'vue';
import { fetchChatStream } from '@/repositories/ChatRepository';

const message = ref('');
const userInput = ref('');
const isLoading = ref(false);

async function startChat() {
  if (!userInput.value.trim()) return;

  message.value = '';
  isLoading.value = true;

  const messages = [
    { role: 'system', content: 'あなたは親切なアシスタントです。' },
    { role: 'user', content: userInput.value },
  ];

  try {
    // コールバック関数で少しづつ渡されるテキストをmessageに追加している
    await fetchChatStream(messages, (text) => {
      message.value += text;
    });
  } catch (e) {
    message.value = 'エラーが発生しました: ' + (e instanceof Error ? e.message : String(e));
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="p-4 max-w-xl mx-auto">
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

    <!-- チャット応答表示 -->
    <div class="whitespace-pre-wrap p-4 rounded mt-4 min-h-[100px]">
      {{ message }}
    </div>

  </div>
</template>
