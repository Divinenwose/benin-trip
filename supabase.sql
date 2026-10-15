-- Run this once in Supabase: SQL Editor > New query > paste > Run.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_hash text unique not null,
  name text not null default '',
  t1 text check (t1 in ('hiace', 'coaster')),
  t2 text check (t2 in ('bus', 'car')),
  updated_at timestamptz not null default now()
);

alter table public.votes enable row level security;

-- Newer Supabase projects do not grant table access automatically.
grant usage on schema public to anon, authenticated;
grant select on public.votes to anon, authenticated;

-- Everyone can read the tally. Nobody can write to the table directly.
drop policy if exists "read votes" on public.votes;
create policy "read votes" on public.votes for select to anon, authenticated using (true);

-- Votes are written only through this function. The voter token never leaves
-- the voter's browser; only its hash is stored, so one person cannot change
-- another person's vote.
create or replace function public.cast_vote(p_voter text, p_name text, p_t1 text, p_t2 text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare h text;
begin
  if p_voter is null or length(p_voter) < 16 then raise exception 'bad voter'; end if;
  h := encode(digest(p_voter, 'sha256'), 'hex');
  insert into public.votes (voter_hash, name, t1, t2, updated_at)
  values (h, left(coalesce(p_name, ''), 24), p_t1, p_t2, now())
  on conflict (voter_hash) do update
    set name = excluded.name, t1 = excluded.t1, t2 = excluded.t2, updated_at = now();
end $$;

revoke all on function public.cast_vote(text, text, text, text) from public;
grant execute on function public.cast_vote(text, text, text, text) to anon, authenticated;

-- To start the vote over at any time:  delete from public.votes;

-- Make the API see the new table and function right away.
notify pgrst, 'reload schema';
