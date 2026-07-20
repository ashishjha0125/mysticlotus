-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  phone text,
  role text not null check (role in ('seeker', 'healer', 'admin', 'coach', 'therapist')),
  roles text[] default '{}',
  status text not null check (status in ('active', 'blocked', 'suspended', 'pending')) default 'pending',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_active_at timestamp with time zone
);

-- HEALERS TABLE
create table public.healers (
  id uuid primary key references public.users(id) on delete cascade,
  status text not null check (status in ('pending', 'approved', 'rejected', 'suspended')) default 'pending',
  modalities text[] default '{}',
  documents_verified boolean default false,
  rating numeric(3,2) default 0.0,
  total_bookings integer default 0,
  total_earnings numeric(10,2) default 0.00,
  bio text
);

-- HEALER DOCUMENTS TABLE
create table public.healer_documents (
  id uuid primary key default uuid_generate_v4(),
  healer_id uuid references public.healers(id) on delete cascade,
  name text not null,
  url text not null,
  type text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- HEALER EARNINGS TABLE
create table public.healer_earnings (
  id uuid primary key default uuid_generate_v4(),
  healer_id uuid references public.healers(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null check (status in ('pending', 'paid')),
  currency text default 'USD',
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BOOKINGS TABLE
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  reference text unique not null,
  seeker_id uuid references public.users(id) on delete set null,
  healer_id uuid references public.healers(id) on delete set null,
  modality text not null,
  scheduled_at timestamp with time zone not null,
  duration_minutes integer not null,
  amount numeric(10,2) not null,
  currency text default 'USD',
  status text not null check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'refunded')) default 'pending',
  payment_status text not null check (payment_status in ('unpaid', 'paid', 'refunded', 'failed')) default 'unpaid',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ACTIVITIES TABLE
create table public.activities (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert a default Admin User (you should set the same email in Supabase Auth and link them)
insert into public.users (id, name, email, role, status)
values (uuid_generate_v4(), 'Admin User', 'admin@mysticlotus.com', 'admin', 'active');

-- RLS POLICIES (Allow authenticated users full access for admin dashboard purposes)
alter table public.users enable row level security;
alter table public.healers enable row level security;
alter table public.healer_documents enable row level security;
alter table public.healer_earnings enable row level security;
alter table public.bookings enable row level security;
alter table public.activities enable row level security;

-- Admin can see and do everything
create policy "Admin access all users" on public.users for all using (true);
create policy "Admin access all healers" on public.healers for all using (true);
create policy "Admin access all healer documents" on public.healer_documents for all using (true);
create policy "Admin access all healer earnings" on public.healer_earnings for all using (true);
create policy "Admin access all bookings" on public.bookings for all using (true);
create policy "Admin access all activities" on public.activities for all using (true);

-- ALTER HEALERS TABLE FOR RICH PROFILE FEATURES
alter table public.healers add column if not exists first_name text;
alter table public.healers add column if not exists last_name text;
alter table public.healers add column if not exists org_name text;
alter table public.healers add column if not exists dob text;
alter table public.healers add column if not exists gender text;
alter table public.healers add column if not exists main_photo_url text;
alter table public.healers add column if not exists video_url text;
alter table public.healers add column if not exists languages text[] default '{"Hindi", "English"}';
alter table public.healers add column if not exists address text;
alter table public.healers add column if not exists state text;
alter table public.healers add column if not exists city text;
alter table public.healers add column if not exists area text;
alter table public.healers add column if not exists pin_code text;
alter table public.healers add column if not exists primary_modality text;
alter table public.healers add column if not exists practicing_since text;
alter table public.healers add column if not exists secondary_modalities text[] default '{}';
alter table public.healers add column if not exists secondary_modalities_text text;
alter table public.healers add column if not exists experience_summary text;
alter table public.healers add column if not exists healing_tool text;
alter table public.healers add column if not exists specialties text[] default '{"Emotional", "Physical", "Spiritual"}';
alter table public.healers add column if not exists fee_currency text default 'INR';
alter table public.healers add column if not exists fee_limit numeric(10,2) default 2500.00;
alter table public.healers add column if not exists fee_range text;
alter table public.healers add column if not exists status_fee text;
alter table public.healers add column if not exists communication_modes text[] default '{"email", "on call", "in person"}';
alter table public.healers add column if not exists days_and_time_of_service text default 'Sunday to Friday : 9 AM to 6 PM';
alter table public.healers add column if not exists reference text;
alter table public.healers add column if not exists certifications text;
alter table public.healers add column if not exists awards text;
alter table public.healers add column if not exists facebook_link text;
alter table public.healers add column if not exists twitter_link text;
alter table public.healers add column if not exists linkedin_link text;
alter table public.healers add column if not exists instagram_link text;
alter table public.healers add column if not exists pinterest_link text;
alter table public.healers add column if not exists status_remark text;

-- ALTER USERS TABLE FOR MULTI-ROLE & EXPANDED ROLES
alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check check (role in ('seeker', 'healer', 'admin', 'coach', 'therapist'));
alter table public.users add column if not exists roles text[] default '{}';

