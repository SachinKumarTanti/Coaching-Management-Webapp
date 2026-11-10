-- ====================================================================
-- Laxmi Competition Classes - Supabase Storage Configuration
-- ====================================================================

-- 1. Create a private bucket for study materials
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'study-materials',
  'study-materials',
  false,
  52428800, -- 50 MB limit
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = 52428800;

-- 2. Storage RLS Policies

-- Allow admins to upload files
create policy "Admins can upload study materials"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'study-materials' and
    public.is_admin()
  );

-- Allow admins to update files
create policy "Admins can update study materials"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'study-materials' and
    public.is_admin()
  );

-- Allow admins to delete files
create policy "Admins can delete study materials"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'study-materials' and
    public.is_admin()
  );

-- Allow authenticated enrolled students or admins to download / read files
create policy "Enrolled students or admins can download study materials"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'study-materials' and (
      public.is_admin() or
      exists (
        select 1 from public.study_materials sm
        join public.enrollments e on e.course_id = sm.course_id
        where sm.file_path = storage.objects.name
          and e.student_id = auth.uid()
      )
    )
  );
