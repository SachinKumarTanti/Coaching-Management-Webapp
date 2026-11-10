-- ====================================================================
-- Laxmi Competition Classes (Sangrampur) - Initial Database Schema
-- Run this in Supabase SQL Editor
-- ====================================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
-- Linked directly to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. COURSES TABLE
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null default 'General',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. ENROLLMENTS TABLE
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, course_id)
);

-- 4. ANNOUNCEMENTS TABLE
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. STUDY MATERIALS TABLE
create table if not exists public.study_materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  file_path text not null,
  file_size bigint default 0,
  file_type text not null default 'application/pdf',
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_enrollments_student on public.enrollments(student_id);
create index if not exists idx_enrollments_course on public.enrollments(course_id);
create index if not exists idx_study_materials_course on public.study_materials(course_id);
create index if not exists idx_announcements_published on public.announcements(is_published, published_at desc);

-- ====================================================================
-- TRIGGERS & FUNCTIONS
-- ====================================================================

-- Auto update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger trigger_courses_updated_at
  before update on public.courses
  for each row execute function public.handle_updated_at();

create trigger trigger_announcements_updated_at
  before update on public.announcements
  for each row execute function public.handle_updated_at();

create trigger trigger_study_materials_updated_at
  before update on public.study_materials
  for each row execute function public.handle_updated_at();

-- Auto-create profile on auth.user sign up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_full_name text;
begin
  user_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Student');
  insert into public.profiles (id, full_name, role)
  values (new.id, user_full_name, 'student')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Security helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer set search_path = public;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.announcements enable row level security;
alter table public.study_materials enable row level security;

-- PROFILES POLICIES
create policy "Users can view their own profile or admin can view all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id or public.is_admin());

-- COURSES POLICIES
create policy "Anyone can view active courses"
  on public.courses for select
  using (is_active = true or public.is_admin());

create policy "Admins can insert courses"
  on public.courses for insert
  with check (public.is_admin());

create policy "Admins can update courses"
  on public.courses for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete courses"
  on public.courses for delete
  using (public.is_admin());

-- ENROLLMENTS POLICIES
create policy "Students can view their own enrollments"
  on public.enrollments for select
  using (student_id = auth.uid() or public.is_admin());

create policy "Admins can manage enrollments"
  on public.enrollments for all
  using (public.is_admin());

-- ANNOUNCEMENTS POLICIES
create policy "Anyone can view published announcements"
  on public.announcements for select
  using (is_published = true or public.is_admin());

create policy "Admins can manage announcements"
  on public.announcements for all
  using (public.is_admin());

-- STUDY MATERIALS POLICIES
create policy "Enrolled students or admins can view study materials"
  on public.study_materials for select
  using (
    public.is_admin() or
    exists (
      select 1 from public.enrollments
      where enrollments.course_id = study_materials.course_id
        and enrollments.student_id = auth.uid()
    )
  );

create policy "Admins can manage study materials"
  on public.study_materials for all
  using (public.is_admin());
