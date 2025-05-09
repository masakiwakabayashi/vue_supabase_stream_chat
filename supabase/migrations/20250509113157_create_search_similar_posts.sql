-- pgvector検索用RPC関数
create or replace function search_similar_posts(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  similarity float
)
language sql
as $$
  select
    id,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from posts
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
