create extension if not exists pgcrypto;

create table if not exists public."ListingSubmission" (
  id uuid primary key default gen_random_uuid(),
  "ownerName" text not null,
  "ownerEmail" text not null,
  "ownerPhone" text not null,
  "ownerNotes" text,
  title text not null,
  type text not null,
  topic text not null,
  purpose text not null,
  value double precision not null,
  city text not null,
  neighborhood text not null,
  address text not null,
  rooms integer not null default 0,
  bathrooms integer not null default 0,
  parking integer not null default 0,
  area double precision not null,
  description text not null,
  status text not null default 'PENDING',
  "adminNotes" text,
  "propertyId" uuid,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint listing_submission_status_check check (status in ('PENDING', 'APPROVED', 'REJECTED'))
);

alter table public."ListingSubmission" enable row level security;

drop policy if exists "Public can submit listing proposals" on public."ListingSubmission";
create policy "Public can submit listing proposals"
on public."ListingSubmission"
for insert
to anon, authenticated
with check (status = 'PENDING');

drop policy if exists "Admins can manage listing proposals" on public."ListingSubmission";
create policy "Admins can manage listing proposals"
on public."ListingSubmission"
for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant insert on public."ListingSubmission" to anon;
grant select, insert, update, delete on public."ListingSubmission" to authenticated;

create index if not exists "ListingSubmission_status_createdAt_idx"
on public."ListingSubmission" (status, "createdAt" desc);
