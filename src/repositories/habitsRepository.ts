import { supabase } from "@/lib/supabaseClient";

/**
 * ユーザーの習慣一覧を取得
 */
export async function getHabits(userId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching habits:', error);
    return [];
  }

  return data;
}
