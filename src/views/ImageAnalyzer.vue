<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow rounded-xl space-y-6">
    <!-- アップロード -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">画像をアップロード</label>
      <input
        type="file"
        accept="image/*"
        @change="onImageSelected"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>

    <!-- プレビュー -->
    <div v-if="imagePreview" class="flex justify-center">
      <img :src="imagePreview" alt="Preview" class="max-w-xs rounded shadow-md" />
    </div>

    <!-- 解析ボタン -->
    <div class="text-center">
      <button
        @click="analyzeImage"
        :disabled="!base64Image || loading"
        class="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? '解析中...' : '画像を解析' }}
      </button>
    </div>

    <!-- 結果表示 -->
    <div v-if="responseText" class="p-4 bg-gray-100 rounded text-gray-800 whitespace-pre-wrap">
      {{ responseText }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const imagePreview = ref(null)
const base64Image = ref(null)
const responseText = ref('')
const loading = ref(false)

function onImageSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    imagePreview.value = reader.result
    base64Image.value = reader.result.split(',')[1] // Base64のみ抽出
  }
  reader.readAsDataURL(file)
}

async function analyzeImage() {
  if (!base64Image.value) return

  loading.value = true
  responseText.value = ''

  const apiKey = import.meta.env.VITE_OPEN_AI_API_KEY

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'この画像には何が写っていますか？' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image.value}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    })
  })

  const data = await response.json()
  responseText.value = data.choices?.[0]?.message?.content || '解析に失敗しました。'
  loading.value = false
}
</script>
