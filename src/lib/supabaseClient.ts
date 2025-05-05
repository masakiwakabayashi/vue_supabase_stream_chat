import { createClient } from '@supabase/supabase-js';

// .envファイルから環境変数を取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Supabaseクライアントを作成
export const supabase = createClient(supabaseUrl, supabaseKey);
