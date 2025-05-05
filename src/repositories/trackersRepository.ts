import { supabase } from "@/lib/supabaseClient";

/**
 * 特定のユーザーの習慣トラッカーデータを取得
 */
export async function getTrackersWithHabits(userId: string) {
  const { data, error } = await supabase
    .from('trackers')
    .select(`
      id, date, completed, habits (id, name)
    `)
    .eq('habits.user_id', userId);

  if (error) {
    console.error('Error fetching trackers:', error);
    return [];
  }

  return data;
}
