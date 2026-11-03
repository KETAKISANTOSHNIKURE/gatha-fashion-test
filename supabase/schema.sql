-- Empty hosted state store for GATHA FASHION.
-- The local data/inventory.json and browser localStorage are not imported.
create table if not exists public.gatha_app_state (
  id text primary key check (id = 'primary'),
  state jsonb not null default '{}'::jsonb
);

alter table public.gatha_app_state enable row level security;
revoke all on table public.gatha_app_state from anon, authenticated;
grant all on table public.gatha_app_state to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gatha-product-photos', 'gatha-product-photos', false, 4000000, array['image/png','image/jpeg'])
on conflict (id) do update set public = false, file_size_limit = 4000000, allowed_mime_types = array['image/png','image/jpeg'];
