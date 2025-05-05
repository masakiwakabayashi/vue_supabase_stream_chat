import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // カウントの初期値
  const count = ref(0)
  // カウントを2倍にする
  const doubleCount = computed(() => count.value * 2)
  // カウントを1増やす
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

// 具体的な使い方
// const counter = useCounterStore()
// counter.increment()
// console.log(counter.count)
// console.log(counter.doubleCount)
