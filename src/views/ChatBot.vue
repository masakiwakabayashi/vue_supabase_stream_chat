
<!-- チャットボットの流れ -->
 
<!-- 
[1] ユーザーが質問する
   ↓
[2] 質問をembeddingに変換（OpenAI Embedding APIなど）
   ↓
[3] Supabaseのベクトル検索で類似コンテンツを取得（pgvector）
   ↓
[4] 類似コンテンツを元にChatGPTにプロンプトを構成
   ↓
[5] ChatGPT APIから回答を生成
   ↓
[6] 回答を表示
-->

<!-- TODO: ベクトルサーチが上手く機能していないので修正する -->

<script setup>
import { ref } from 'vue'
import { getAnswerFromQuestion } from '@/repositories/ChatBotRepository'

const userInput = ref('')
const answer = ref('')

const handleSubmit = async () => {
  answer.value = '検索中...'
  answer.value = await getAnswerFromQuestion(userInput.value)
}
</script>

<template>
  <div>
    <h1 class="flex items-center justify-center text-4xl font-bold text-gray-800 my-8">
      <span class="border-b-2 border-blue-600 pb-1 px-2">保存されているデータを元に回答するチャットボット機能</span>
    </h1>
  </div>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
    <input
      v-model="userInput"
      placeholder="質問を入力"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      @click="handleSubmit"
      class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    >
      送信
    </button>
  </div>
  <div class="mt-4 p-4 rounded-lg whitespace-pre-wrap">
    {{ answer }}
  </div>
</template>
