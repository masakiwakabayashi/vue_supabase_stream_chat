<!-- MEMO: pdf-libはPDFの文字の抽出ができないので、pdf-parseを使う -->
<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import pdfParse from 'pdf-parse'

const text = ref('')
const error = ref('')

const onFileChange = async (event: Event) => {
  error.value = ''
  text.value = ''
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  try {
    const arrayBuffer = await file.arrayBuffer()
    // @ts-ignore
    const buffer = Buffer.from(arrayBuffer)
    const data = await pdfParse(buffer)
    text.value = data.text
  } catch (e: any) {
    error.value = 'PDFの解析に失敗しました: ' + (e?.message || e)
  }
}
</script>

<template>
  <div>
    <h1>PDFテキスト抽出</h1>
    <input type="file" accept="application/pdf" @change="onFileChange" />
    <div v-if="text">
      <h2>抽出結果</h2>
      <pre>{{ text }}</pre>
    </div>
    <div v-if="error" style="color: red;">
      {{ error }}
    </div>
  </div>
</template>

