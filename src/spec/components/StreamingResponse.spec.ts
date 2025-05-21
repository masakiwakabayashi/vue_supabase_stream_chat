import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import StreamingResponse from '@/views/StreamingResponse.vue';

// fetchChatStreamをモック
vi.mock('@/repositories/ChatRepository', () => ({
  fetchChatStream: vi.fn(),
}));

describe('StreamingResponse.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期表示で入力欄と送信ボタンが表示され、履歴が空である', () => {
    const wrapper = mount(StreamingResponse);
    // 入力欄
    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);
    expect(textarea.element.value).toBe('');
    // 送信ボタン
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('チャット送信');
    // チャット履歴
    expect(wrapper.findAll('ul li').length).toBe(0);
    // 応答表示
    expect(wrapper.find('.whitespace-pre-wrap.rounded').text()).toBe('');
  });

  it('ユーザー入力→送信でfetchChatStreamが呼ばれ、ストリーミング応答がUIに反映される', async () => {
    const { fetchChatStream } = await import('@/repositories/ChatRepository');
    // モック: コールバックで2回テキストを返す
    (fetchChatStream as any).mockImplementation(async (_messages: any, cb: any) => {
      cb('こん');
      cb('にちは');
    });

    const wrapper = mount(StreamingResponse);

    // 入力
    const textarea = wrapper.find('textarea');
    await textarea.setValue('こんにちは？');
    // 送信ボタン
    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeUndefined();

    // クリック
    await button.trigger('click');
    // isLoading中はボタンがdisabledかつラベルが「送信中...」
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    expect(wrapper.find('button').text()).toBe('送信中...');

    // flushPromisesで非同期処理待ち
    await flushPromises();

    // ストリーミング応答が一時的に表示される
    expect(wrapper.find('.whitespace-pre-wrap.rounded').text()).toBe('こんにちは');

    // chatMessagesにpushされ、履歴に表示される
    const items = wrapper.findAll('ul li');
    expect(items.length).toBe(1);
    expect(items[0].text()).toContain('こんにちは？');
    expect(items[0].text()).toContain('こんにちは');

    // 入力欄がクリアされている
    expect(wrapper.find('textarea').element.value).toBe('');
    // isLoadingがfalseになり、ボタンが有効・ラベルが戻る
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    expect(wrapper.find('button').text()).toBe('チャット送信');
  });
});
