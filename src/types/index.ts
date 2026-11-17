import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type Announcement = Database['public']['Tables']['announcements']['Row'];
export type StudyMaterial = Database['public']['Tables']['study_materials']['Row'];
export type CourseRequest = Database['public']['Tables']['course_requests']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type BugReport = Database['public']['Tables']['bug_reports']['Row'];

export interface EnrolledCourse extends Course {
  enrollment_id: string;
  enrolled_at: string;
}

export interface StudentWithEnrollments extends Profile {
  email?: string;
  enrolled_course_ids: string[];
}

export interface StudyMaterialWithCourse extends StudyMaterial {
  course_title?: string;
}
