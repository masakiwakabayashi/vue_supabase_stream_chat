<script setup>
import { ref } from 'vue';
import { fetchChatStream } from '@/repositories/ChatRepository';

const message = ref('');
const isLoading = ref(false);

async function startChat() {
  message.value = '';
  isLoading.value = true;
  const messages = [
    { role: 'system', content: 'あなたは親切なアシスタントです。' },
    { role: 'user', content: 'こんにちは！' },
  ];
  try {
    await fetchChatStream(messages, (text) => {
      message.value += text; // 文字が届くたびに追加していく
    });
  } catch (e) {
    message.value = 'エラーが発生しました: ' + (e instanceof Error ? e.message : String(e));
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="p-4">
    <div class="whitespace-pre-wrap border p-4 rounded">
      {{ message }}
    </div>
    <button @click="startChat" :disabled="isLoading" class="mt-4 p-2 bg-blue-500 text-white rounded">
      {{ isLoading ? '送信中...' : 'チャット開始' }}
    </button>
  </div>
</template>
