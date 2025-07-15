<script setup lang="ts">
import { ref } from 'vue';
import { savePost } from '@/repositories/SavePostRepository';

const text = ref('');
const message = ref('');

const save = async () => {
  if (!text.value.trim()) return;

  try {
    message.value = '保存中...';
    await savePost(text.value);
    message.value = '保存しました ✅';
    text.value = '';
  } catch (err: any) {
    message.value = 'エラー: ' + err.message;
  }
};
</script>

<template>
  <div>
    <h1 class="flex items-center justify-center text-4xl font-bold text-gray-800 my-8">
      <span class="border-b-2 border-blue-600 pb-1 px-2">テキストをベクトルデータとして保存する機能</span>
    </h1>
  </div>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
    <textarea
      v-model="text"
      class="w-full p-3 border rounded mb-4"
      rows="5"
      placeholder="テキストを入力してください"
    />
    <button
      @click="save"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      保存する
    </button>
    <p class="mt-4 text-gray-700">{{ message }}</p>
  </div>
</template>
