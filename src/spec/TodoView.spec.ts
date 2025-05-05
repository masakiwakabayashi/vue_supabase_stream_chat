import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router';
import TodoView from '@/views/experiment/TodoView.vue';


describe('Todoページのテスト', () => {
  it('Todoのデータが表示されること', async () => {
    const routes = [
      {
        path: '/todo/:id',
        component: TodoView,
      },
    ];
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });

    router.push('/todo/1');
    await router.isReady();

    const wrapper = shallowMount(TodoView,{
      global: {
        plugins: [router]
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
