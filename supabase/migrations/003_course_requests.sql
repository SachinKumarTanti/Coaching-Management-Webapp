-- ====================================================================
-- 003_course_requests.sql
-- Table and policies for student course join requests & admin approval
-- ====================================================================

create table if not exists public.course_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, course_id)
);

-- Trigger to update updated_at
create trigger trigger_course_requests_updated_at
  before update on public.course_requests
  for each row execute function public.handle_updated_at();

-- Indexes for fast query lookup
create index if not exists idx_course_requests_student on public.course_requests(student_id);
create index if not exists idx_course_requests_course on public.course_requests(course_id);
create index if not exists idx_course_requests_status on public.course_requests(status);

-- Enable Row Level Security
alter table public.course_requests enable row level security;

-- Policies:
-- 1. Students can view their own requests, Admins can view all
create policy "Students view own requests or admin views all"
  on public.course_requests for select
  using (auth.uid() = student_id or public.is_admin());

-- 2. Students can submit join request for themselves
create policy "Students can submit join request"
  on public.course_requests for insert
  with check (auth.uid() = student_id);

-- 3. Admins can update requests (Accept / Reject)
create policy "Admins can update course requests"
  on public.course_requests for update
  using (public.is_admin())
  with check (public.is_admin());

-- 4. Admins or student owners can delete request
create policy "Admins or owners can delete course requests"
  on public.course_requests for delete
  using (auth.uid() = student_id or public.is_admin());
