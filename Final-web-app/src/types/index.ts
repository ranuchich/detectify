export type UserRole = 'student' | 'company' | 'admin';

export interface Company {
  company_id: number;
  company_name: string;
  industry: string;
  location: string;
  logo_url?: string;
  website?: string;
  created_at: string;
}

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Profile {
  user_id: number;
  bio: string | null;
  headline: string | null;
  location: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface Job {
  job_id: number;
  company_id: number | null;
  title: string;
  description: string;
  location: string;
  salary: number;
  employment_type: string;
  posted_date: string;
  is_active: boolean;
  created_at: string;
  company?: Company; // Joined data
}

export interface Application {
  application_id: number;
  user_id: number;
  job_id: number;
  applied_date: string;
  status: string;
  resume_url?: string;
  created_at: string;
  job?: Job; // Joined data
  user?: User; // Joined data
}

export interface Skill {
  skill_id: number;
  skill_name: string;
  category?: string;
}

export interface UserSkill {
  user_id: number;
  skill_id: number;
  proficiency_level?: string;
  skill?: Skill;
}

export interface JobSkill {
  jobskill_id: number;
  job_id: number;
  skill_id: number;
  importance_level: string;
  skill?: Skill;
}

export interface Education {
  education_id: number;
  user_id: number;
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  gpa?: number;
}

export interface Experience {
  experience_id: number;
  user_id: number;
  position_title: string;
  company_name: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string | null;
}

export interface UserJobMatch {
  match_id: number;
  user_id: number;
  job_id: number;
  match_score: number;
  matched_skills_count: number;
  missing_skills_count: number;
  created_at: string;
}

// Backward compatibility or shared profile type from auth
export interface AuthProfile {
  id: string; // UUID from Auth
  role: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}
