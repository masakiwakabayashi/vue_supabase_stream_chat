-- ストアドプロシージャを作成
CREATE OR REPLACE FUNCTION insert_post_with_embedding(
  p_content TEXT,
  p_embedding FLOAT8[] -- float配列を受け取る
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO posts (content, embedding)
  VALUES (p_content, p_embedding::vector(1536)); -- 明示的にvector型にキャスト
END;
$$;

