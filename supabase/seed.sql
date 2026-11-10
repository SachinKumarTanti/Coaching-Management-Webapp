-- ====================================================================
-- Laxmi Competition Classes - Seed Data
-- ====================================================================

-- Starter Courses
insert into public.courses (id, title, description, category, is_active)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'General Competition Foundation Batch',
    'Comprehensive preparation for SSC, Railway, Banking, and State exams with daily practice sheets and concept building by Vishal Sir.',
    'Foundation',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'SSC CGL / CHSL Special Batch',
    'Targeted course covering Advanced Mathematics, Reasoning, English comprehension, and General Studies with past 10 years question analysis.',
    'SSC',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Railway NTPC & Group D Crash Course',
    'Fast-track revision batch with focus on General Science, Numerical Ability, and Mock Tests designed for upcoming Railway recruitment.',
    'Railway',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Bihar Police & Daroga (SI) Special',
    'Dedicated preparation for Bihar Police Constable and Sub-Inspector exams with specialized GS and current affairs modules.',
    'State Exams',
    true
  )
on conflict (id) do nothing;

-- Starter Announcements
insert into public.announcements (title, content, is_published, published_at)
values
  (
    'Admissions Open for New Morning Batch 2026-2027',
    'Fresh batches for SSC and Railway foundation are starting from next Monday at our Sangrampur center. Contact Vishal Sir or visit the center for registration.',
    true,
    now()
  ),
  (
    'Special Sunday Mock Test & Doubt Session',
    'Every Sunday at 9:00 AM, an all-India pattern offline mock test is conducted followed by live doubt-clearing sessions by Vishal Sir.',
    true,
    now() - interval '2 days'
  ),
  (
    'Digital Notes & PDF Portal Launched',
    'Students can now log in to the student portal to access class notes, question banks, and monthly current affairs PDFs directly on their mobile phones.',
    true,
    now() - interval '5 days'
  );

-- Note on Creating First Admin:
-- 1. Sign up on the app using your email (e.g. vishalsir@laxmiclasses.com)
-- 2. Run this query in Supabase SQL editor:
--    UPDATE public.profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'vishalsir@laxmiclasses.com');
