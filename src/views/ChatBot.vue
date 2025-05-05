
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


<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
    <h1 class="text-xl font-bold mb-4">チャットボットページ</h1>








  </div>
</template>


