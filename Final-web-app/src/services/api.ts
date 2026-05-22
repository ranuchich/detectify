import { supabase } from '@/lib/supabase';

// Generic CRUD service factory
export const createService = <T>(tableName: string, idField: string = 'id') => ({
  getAll: async () => {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as T[];
  },

  getById: async (id: string | number) => {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq(idField, id)
      .single();
    if (error) throw error;
    return data as T;
  },

  create: async (item: Partial<T>) => {
    const { data, error } = await supabase
      .from(tableName)
      .insert(item as any)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  },

  update: async (id: string | number, updates: Partial<T>) => {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates as any)
      .eq(idField, id)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  },

  delete: async (id: string | number) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq(idField, id);
    if (error) throw error;
  },
});

// Specific Services for Job Finder
export const companyService = createService('company', 'company_id');
export const userService = createService('users', 'user_id');
export const profileService = createService('profile', 'user_id');

export const jobService = {
  ...createService('job', 'job_id'),
  getAllWithCompany: async () => {
    const { data, error } = await supabase
      .from('job')
      .select('*, company(*)')
      .eq('is_active', true)
      .order('posted_date', { ascending: false });
    if (error) throw error;
    return data;
  }
};

export const applicationService = {
  ...createService('application', 'application_id'),
  getByUser: async (userId: number) => {
    const { data, error } = await supabase
      .from('application')
      .select('*, job(*, company(*))')
      .eq('user_id', userId)
      .order('applied_date', { ascending: false });
    if (error) throw error;
    return data;
  },
  getByJob: async (jobId: number) => {
    const { data, error } = await supabase
      .from('application')
      .select('*, users(*)')
      .eq('job_id', jobId)
      .order('applied_date', { ascending: false });
    if (error) throw error;
    return data;
  }
};

export const skillService = createService('skill', 'skill_id');
export const educationService = createService('education', 'education_id');
export const experienceService = createService('experience', 'experience_id');
export const matchService = createService('user_job_match', 'match_id');

// Legacy compatibility (re-mapping to keep components from breaking immediately)
export const productService = jobService;
export const customerService = userService;
export const orderService = applicationService;
