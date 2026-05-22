import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const getSupabaseConfig = () => {
  if (typeof window === 'undefined') {
    return {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      key: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    };
  }
  return {
    url: localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL || '',
    key: localStorage.getItem('supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  };
};

export const isSupabaseConfigured = Boolean(
  (typeof window !== 'undefined' && localStorage.getItem('supabase_url') && localStorage.getItem('supabase_anon_key')) ||
  (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
);

export const saveSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabase_url', url.trim());
    localStorage.setItem('supabase_anon_key', key.trim());
    localStorage.removeItem('sandbox_session'); // clear mock session
  }
};

export const clearSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
  }
};

let supabaseInstance: SupabaseClient | null = null;

// Initial sandbox mock databases
const INITIAL_DEMO_COMPANIES = [
  {
    company_id: 1,
    company_name: "Detectify Labs",
    industry: "Cybersecurity & SaaS",
    location: "Stockholm, Sweden",
    logo_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
    website: "https://detectify.com"
  },
  {
    company_id: 2,
    company_name: "Acme Tech Solutions",
    industry: "SaaS Software",
    location: "San Francisco, CA",
    logo_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=80",
    website: "https://acme.com"
  }
];

const INITIAL_DEMO_USERS = [
  {
    user_id: 1,
    first_name: "Alex",
    last_name: "Rivera",
    email: "admin@detectify.com",
    role: "admin",
    created_at: "2026-01-15T08:00:00Z"
  },
  {
    user_id: 2,
    first_name: "Sarah",
    last_name: "Chen",
    email: "recruiter@detectify.com",
    role: "company",
    created_at: "2026-02-10T11:30:00Z"
  },
  {
    user_id: 3,
    first_name: "Liam",
    last_name: "Johnson",
    email: "applicant@detectify.com",
    role: "student",
    created_at: "2026-03-01T14:45:00Z"
  }
];

const INITIAL_DEMO_PROFILES = [
  {
    user_id: 1,
    full_name: "Alex Rivera",
    role: "admin",
    bio: "Senior Cybersecurity Lead & System Supervisor",
    headline: "Detectify Platform Administrator",
    location: "San Jose, CA",
    avatar_url: null,
    updated_at: "2026-05-14T12:00:00Z"
  },
  {
    user_id: 2,
    full_name: "Sarah Chen",
    role: "company",
    bio: "Lead Talent Partner at Acme & Detectify Labs",
    headline: "Senior Recruiter",
    location: "San Francisco, CA",
    avatar_url: null,
    updated_at: "2026-05-14T12:00:00Z"
  },
  {
    user_id: 3,
    full_name: "Liam Johnson",
    role: "student",
    bio: "Computer Science Senior looking for cybersecurity internships",
    headline: "Fullstack Engineering Student",
    location: "Austin, TX",
    avatar_url: null,
    updated_at: "2026-05-14T12:00:00Z"
  }
];

const INITIAL_DEMO_JOBS = [
  {
    job_id: 101,
    company_id: 1,
    title: "Security Engineering Intern",
    description: "Work on vulnerability scanner systems and automated fuzzing infrastructure using Go and React. You will be paired with a senior mentor, participate in threat modeling, and write automated tests for our web vulnerability scanner.",
    location: "Remote / Hybrid (Stockholm)",
    salary: 45000,
    employment_type: "Internship",
    posted_date: "2026-05-10T09:00:00Z",
    is_active: true,
    created_at: "2026-05-10T09:00:00Z"
  },
  {
    job_id: 102,
    company_id: 2,
    title: "Frontend React Specialist",
    description: "Help craft our next-generation asset management dashboards. Strong TypeScript, CSS grid, and Tailwind skills desired. You will be responsible for creating fluid layouts, maintaining component files, and collaborating on UI design.",
    location: "San Francisco, CA",
    salary: 110000,
    employment_type: "Full-time",
    posted_date: "2026-05-12T10:30:00Z",
    is_active: true,
    created_at: "2026-05-12T10:30:00Z"
  },
  {
    job_id: 103,
    company_id: 1,
    title: "AI Security Apprentice",
    description: "Explore state-of-the-art LLM safety controls and prompt injection defenses. Ideal experience for graduate students in computer science with an emphasis on adversarial machine learning.",
    location: "Remote (Global)",
    salary: 60000,
    employment_type: "Contract",
    posted_date: "2026-05-13T14:00:00Z",
    is_active: true,
    created_at: "2026-05-13T14:00:00Z"
  }
];

const INITIAL_DEMO_APPLICATIONS = [
  {
    application_id: 501,
    user_id: 3,
    job_id: 101,
    applied_date: "2026-05-11T16:20:00Z",
    status: "Offered",
    created_at: "2026-05-11T16:20:00Z"
  },
  {
    application_id: 502,
    user_id: 3,
    job_id: 102,
    applied_date: "2026-05-13T10:00:00Z",
    status: "Applied",
    created_at: "2026-05-13T10:00:00Z"
  }
];

// LocalStorage helpers
export const getStorageItem = <T>(key: string, initial: T): T => {
  if (typeof window === 'undefined') return initial;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(val);
  } catch {
    return initial;
  }
};

export const setStorageItem = <T>(key: string, val: T) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

// Mock Query Builder
class MockSupabaseQueryBuilder {
  tableName: string;
  filters: Array<(item: any) => boolean> = [];
  sortField: string | null = null;
  sortAscending: boolean = false;
  isSingle: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(projection: string = '*') {
    return this;
  }

  order(field: string, options?: { ascending: boolean }) {
    this.sortField = field;
    this.sortAscending = options?.ascending ?? false;
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((item) => {
      const itemVal = item[field];
      if (itemVal === undefined) return true;
      return String(itemVal) === String(value);
    });
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async then(onfulfilled: (value: any) => any) {
    try {
      const data = await this.execute();
      return onfulfilled({ data, error: null });
    } catch (err: any) {
      return onfulfilled({ data: null, error: err });
    }
  }

  async execute() {
    const initialDataMap: Record<string, any[]> = {
      company: INITIAL_DEMO_COMPANIES,
      users: INITIAL_DEMO_USERS,
      profiles: INITIAL_DEMO_PROFILES,
      profile: INITIAL_DEMO_PROFILES,
      job: INITIAL_DEMO_JOBS,
      application: INITIAL_DEMO_APPLICATIONS
    };

    const initial = initialDataMap[this.tableName] || [];
    const items = getStorageItem<any[]>(`db_${this.tableName}`, initial);

    let result = [...items];
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    if (this.sortField) {
      const field = this.sortField;
      const asc = this.sortAscending;
      result.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (valA < valB) return asc ? -1 : 1;
        if (valA > valB) return asc ? 1 : -1;
        return 0;
      });
    }

    // simulated joins
    if (this.tableName === 'job') {
      const companies = getStorageItem<any[]>('db_company', INITIAL_DEMO_COMPANIES);
      result = result.map(j => ({
        ...j,
        company: companies.find(c => c.company_id === j.company_id)
      }));
    } else if (this.tableName === 'application') {
      const jobs = getStorageItem<any[]>('db_job', INITIAL_DEMO_JOBS);
      const companies = getStorageItem<any[]>('db_company', INITIAL_DEMO_COMPANIES);
      const users = getStorageItem<any[]>('db_users', INITIAL_DEMO_USERS);
      result = result.map(app => {
        const j = jobs.find(job => job.job_id === app.job_id);
        return {
          ...app,
          job: j ? { ...j, company: companies.find(c => c.company_id === j.company_id) } : undefined,
          user: users.find(u => u.user_id === app.user_id)
        };
      });
    }

    if (this.isSingle) {
      if (result.length === 0) {
        throw new Error(`Record not found in ${this.tableName}`);
      }
      return result[0];
    }

    return result;
  }

  insert(rowOrRows: any) {
    const initialDataMap: Record<string, any[]> = {
      company: INITIAL_DEMO_COMPANIES,
      users: INITIAL_DEMO_USERS,
      profiles: INITIAL_DEMO_PROFILES,
      profile: INITIAL_DEMO_PROFILES,
      job: INITIAL_DEMO_JOBS,
      application: INITIAL_DEMO_APPLICATIONS
    };

    const tableNameKey = this.tableName === 'profiles' ? 'profile' : this.tableName;
    const initial = initialDataMap[tableNameKey] || [];
    const items = getStorageItem<any[]>(`db_${tableNameKey}`, initial);

    const isArray = Array.isArray(rowOrRows);
    const rows = isArray ? rowOrRows : [rowOrRows];

    const inserted: any[] = [];
    const idFields: Record<string, string> = {
      company: 'company_id',
      users: 'user_id',
      profiles: 'user_id',
      profile: 'user_id',
      job: 'job_id',
      application: 'application_id'
    };
    const idField = idFields[tableNameKey] || 'id';

    for (const row of rows) {
      const nextId = items.length > 0 ? String(Math.max(...items.map(i => Number(i[idField]) || 0)) + 1) : "1";
      const newRow = {
        [idField]: tableNameKey === 'profile' ? Number(row.id || row.user_id || nextId) : Number(nextId),
        created_at: new Date().toISOString(),
        ...row
      };
      items.push(newRow);
      inserted.push(newRow);
    }

    setStorageItem(`db_${tableNameKey}`, items);

    return {
      select: () => ({
        single: async () => ({ data: inserted[0], error: null }),
        then: (onfulfilled: any) => onfulfilled({ data: isArray ? inserted : inserted[0], error: null })
      }),
      then: (onfulfilled: any) => onfulfilled({ data: isArray ? inserted : inserted[0], error: null })
    };
  }

  update(updates: any) {
    const tableNameKey = this.tableName === 'profiles' ? 'profile' : this.tableName;
    const idFields: Record<string, string> = {
      company: 'company_id',
      users: 'user_id',
      profile: 'user_id',
      job: 'job_id',
      application: 'application_id'
    };
    const idField = idFields[tableNameKey] || 'id';

    const updateHandler = {
      eq: (field: string, value: any) => {
        this.eq(field, value);
        return {
          select: () => ({
            single: async () => {
              const data = await this.executeUpdates(tableNameKey, updates);
              return { data: data[0], error: null };
            },
            then: async (onfulfilled: any) => {
              const data = await this.executeUpdates(tableNameKey, updates);
              onfulfilled({ data, error: null });
            }
          }),
          then: async (onfulfilled: any) => {
            const data = await this.executeUpdates(tableNameKey, updates);
            onfulfilled({ data, error: null });
          }
        };
      }
    };

    return updateHandler;
  }

  private async executeUpdates(tableNameKey: string, updates: any) {
    const initialDataMap: Record<string, any[]> = {
      company: INITIAL_DEMO_COMPANIES,
      users: INITIAL_DEMO_USERS,
      profiles: INITIAL_DEMO_PROFILES,
      profile: INITIAL_DEMO_PROFILES,
      job: INITIAL_DEMO_JOBS,
      application: INITIAL_DEMO_APPLICATIONS
    };

    const initial = initialDataMap[tableNameKey] || [];
    const items = getStorageItem<any[]>(`db_${tableNameKey}`, initial);

    const updated: any[] = [];
    const newItems = items.map(item => {
      let matches = true;
      for (const filter of this.filters) {
        if (!filter(item)) {
          matches = false;
          break;
        }
      }

      if (matches) {
        const newItem = { ...item, ...updates, updated_at: new Date().toISOString() };
        updated.push(newItem);
        return newItem;
      }
      return item;
    });

    setStorageItem(`db_${tableNameKey}`, newItems);
    return updated;
  }

  delete() {
    const tableNameKey = this.tableName === 'profiles' ? 'profile' : this.tableName;
    const deleteHandler = {
      eq: (field: string, value: any) => {
        this.eq(field, value);
        return {
          then: async (onfulfilled: any) => {
            const initialDataMap: Record<string, any[]> = {
              company: INITIAL_DEMO_COMPANIES,
              users: INITIAL_DEMO_USERS,
              profile: INITIAL_DEMO_PROFILES,
              job: INITIAL_DEMO_JOBS,
              application: INITIAL_DEMO_APPLICATIONS
            };
        
            const initial = initialDataMap[tableNameKey] || [];
            const items = getStorageItem<any[]>(`db_${tableNameKey}`, initial);
        
            const newItems = items.filter(item => {
              let matches = true;
              for (const filter of this.filters) {
                if (!filter(item)) {
                  matches = false;
                  break;
                }
              }
              return !matches;
            });
        
            setStorageItem(`db_${tableNameKey}`, newItems);
            onfulfilled({ error: null });
          }
        };
      }
    };

    return deleteHandler;
  }
}

// Mock Auth Class
class MockAuthManager {
  private listeners: Array<(_event: any, session: any) => void> = [];

  private getSessionData() {
    const sessionStr = localStorage.getItem('sandbox_session');
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  }

  private setSessionData(session: any) {
    if (session) {
      localStorage.setItem('sandbox_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('sandbox_session');
    }
    this.notifyListeners(session);
  }

  private notifyListeners(session: any) {
    const event = session ? 'SIGNED_IN' : 'SIGNED_OUT';
    this.listeners.forEach(cb => cb(event, session));
  }

  async getSession() {
    const session = this.getSessionData();
    return { data: { session }, error: null };
  }

  onAuthStateChange(callback: (_event: any, session: any) => void) {
    this.listeners.push(callback);
    const session = this.getSessionData();
    // Use setTimeout so listener callback triggers asynchronously mimicking Supabase behavior
    setTimeout(() => {
      callback(session ? 'INITIAL_SESSION' : 'SIGNED_OUT', session);
    }, 0);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
          }
        }
      }
    };
  }

  async signInWithPassword(credentials: { email: string; password?: string }) {
    const { email } = credentials;
    const users = getStorageItem<any[]>('db_users', INITIAL_DEMO_USERS);
    let matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      const isSpecAdmin = email.includes('admin');
      const isSpecComp = email.includes('recruiter') || email.includes('partner') || email.includes('company');
      const role = isSpecAdmin ? 'admin' : (isSpecComp ? 'company' : 'student');
      
      const emailParts = email.split('@');
      const firstPart = emailParts[0];
      const fallbackFirstName = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
      
      matchedUser = {
        user_id: users.length + 1,
        first_name: fallbackFirstName,
        last_name: "Detectifyer",
        email: email,
        role: role,
        created_at: new Date().toISOString()
      };
      
      users.push(matchedUser);
      setStorageItem('db_users', users);

      const profiles = getStorageItem<any[]>('db_profile', INITIAL_DEMO_PROFILES);
      profiles.push({
        user_id: matchedUser.user_id,
        full_name: `${matchedUser.first_name} ${matchedUser.last_name}`,
        role: matchedUser.role,
        bio: `Hello! I'm ${matchedUser.first_name}, part of the Detectify Jobs network.`,
        headline: role === 'admin' ? 'Admin' : (role === 'company' ? 'Company Partner' : 'Applicant Candidate'),
        location: 'Stockholm, Sweden',
        avatar_url: null,
        updated_at: new Date().toISOString()
      });
      setStorageItem('db_profile', profiles);
    }

    const profiles = getStorageItem<any[]>('db_profile', INITIAL_DEMO_PROFILES);
    const matchedProfile = profiles.find(p => p.user_id == matchedUser.user_id) || {
      user_id: matchedUser.user_id,
      full_name: `${matchedUser.first_name} ${matchedUser.last_name}`,
      role: matchedUser.role,
      bio: '',
      headline: '',
      location: '',
      avatar_url: null,
      updated_at: new Date().toISOString()
    };

    const session = {
      access_token: 'mock-jwt-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: String(matchedUser.user_id),
        email: matchedUser.email,
        user_metadata: {
          full_name: matchedProfile.full_name
        },
        aud: 'authenticated',
        role: 'authenticated',
        created_at: matchedUser.created_at
      }
    };

    this.setSessionData(session);
    return { data: { session, user: session.user }, error: null };
  }

  async signUp(data: { email: string; password?: string; options?: { data?: { full_name?: string } } }) {
    const users = getStorageItem<any[]>('db_users', INITIAL_DEMO_USERS);
    const email = data.email;
    const fullName = data.options?.data?.full_name || 'Anonymous User';
    
    const names = fullName.trim().split(' ');
    const firstName = names[0] || 'User';
    const lastName = names.slice(1).join(' ') || 'Detectifyer';
    
    const isSpecAdmin = email.includes('admin');
    const isSpecComp = email.includes('recruiter') || email.includes('partner') || email.includes('company');
    const role = isSpecAdmin ? 'admin' : (isSpecComp ? 'company' : 'student');

    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.user_id)) + 1 : 1;
    const newUser = {
      user_id: newUserId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      role: role,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    setStorageItem('db_users', users);

    const profiles = getStorageItem<any[]>('db_profile', INITIAL_DEMO_PROFILES);
    profiles.push({
      user_id: newUserId,
      full_name: fullName,
      role: role,
      bio: "New candidate profile on Detectify Jobs.",
      headline: role === 'admin' ? 'System Administrator' : (role === 'company' ? 'Recruiter' : 'Acquisitive Student'),
      location: 'Stockholm, Sweden',
      avatar_url: null,
      updated_at: new Date().toISOString()
    });
    setStorageItem('db_profile', profiles);

    const authUser = {
      id: String(newUserId),
      email: email,
      user_metadata: {
        full_name: fullName
      },
      aud: 'authenticated',
      role: 'authenticated',
      created_at: newUser.created_at
    };

    return { 
      data: { 
        user: authUser, 
        session: {
          access_token: 'mock-jwt-token',
          user: authUser
        }
      }, 
      error: null 
    };
  }

  async signOut() {
    this.setSessionData(null);
    return { error: null };
  }
}

const mockAuth = new MockAuthManager();

class CoexistingAuthManager {
  private listeners: Array<(_event: any, session: any) => void> = [];

  constructor() {
    if (isSupabaseConfigured) {
      if (!supabaseInstance) {
        const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      }
      
      supabaseInstance.auth.onAuthStateChange((event, session) => {
        const mockSession = localStorage.getItem('sandbox_session');
        if (!mockSession) {
          this.notifyListeners(event, session);
        }
      });
    }
  }

  private notifyListeners(event: any, session: any) {
    this.listeners.forEach(cb => {
      try {
        cb(event, session);
      } catch (err) {
        console.error('Error in auth listener:', err);
      }
    });
  }

  private isSandboxEmail(email: string): boolean {
    const demoEmails = ['admin@detectify.com', 'recruiter@detectify.com', 'applicant@detectify.com'];
    return demoEmails.includes(email.toLowerCase());
  }

  async getSession() {
    const mockSessionStr = localStorage.getItem('sandbox_session');
    if (mockSessionStr) {
      try {
        const session = JSON.parse(mockSessionStr);
        return { data: { session }, error: null };
      } catch {
        // ignore
      }
    }

    if (isSupabaseConfigured) {
      if (!supabaseInstance) {
        const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      }
      return supabaseInstance.auth.getSession();
    }

    return { data: { session: null }, error: null };
  }

  onAuthStateChange(callback: (_event: any, session: any) => void) {
    this.listeners.push(callback);
    
    const mockSessionStr = localStorage.getItem('sandbox_session');
    if (mockSessionStr) {
      try {
        const session = JSON.parse(mockSessionStr);
        setTimeout(() => {
          callback('INITIAL_SESSION', session);
        }, 0);
      } catch {
        // fallback
      }
    } else if (isSupabaseConfigured) {
      if (!supabaseInstance) {
        const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      }
      supabaseInstance.auth.getSession().then(({ data: { session } }) => {
        if (!localStorage.getItem('sandbox_session')) {
          callback(session ? 'INITIAL_SESSION' : 'SIGNED_OUT', session);
        }
      });
    } else {
      setTimeout(() => {
        callback('SIGNED_OUT', null);
      }, 0);
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
          }
        }
      }
    };
  }

  async signInWithPassword(credentials: any) {
    const { email } = credentials;
    
    if (this.isSandboxEmail(email)) {
      if (isSupabaseConfigured) {
        if (!supabaseInstance) {
          const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();
          supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
        }
        await supabaseInstance.auth.signOut();
      }
      const result = await mockAuth.signInWithPassword(credentials);
      this.notifyListeners('SIGNED_IN', result.data.session);
      return result;
    }

    if (isSupabaseConfigured) {
      if (!supabaseInstance) {
        const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      }
      try {
        localStorage.removeItem('sandbox_session');
        mockAuth.signOut();
        
        const result = await supabaseInstance.auth.signInWithPassword(credentials);
        if (result.error) {
          console.warn('Real Supabase Auth failed, falling back to sandbox local auth', result.error);
          const mockResult = await mockAuth.signInWithPassword(credentials);
          this.notifyListeners('SIGNED_IN', mockResult.data.session);
          return mockResult;
        }
        this.notifyListeners('SIGNED_IN', result.data.session);
        return result;
      } catch (err: any) {
        console.warn('Real Supabase Auth threw error, falling back to sandbox local auth', err);
        const mockResult = await mockAuth.signInWithPassword(credentials);
        this.notifyListeners('SIGNED_IN', mockResult.data.session);
        return mockResult;
      }
    }

    const mockResult = await mockAuth.signInWithPassword(credentials);
    this.notifyListeners('SIGNED_IN', mockResult.data.session);
    return mockResult;
  }

  async signUp(data: any) {
    if (isSupabaseConfigured) {
      if (!supabaseInstance) {
        const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      }
      try {
        const result = await supabaseInstance.auth.signUp(data);
        if (result.error) {
          console.warn('Real Supabase signUp failed, falling back to local sandbox auth', result.error);
          const mockResult = await mockAuth.signUp(data);
          await mockAuth.signInWithPassword({ email: data.email, password: data.password });
          this.notifyListeners('SIGNED_IN', mockResult.data.session);
          return mockResult;
        }
        return result;
      } catch (err: any) {
        console.warn('Real Supabase signUp threw error, falling back to local sandbox auth', err);
        const mockResult = await mockAuth.signUp(data);
        await mockAuth.signInWithPassword({ email: data.email, password: data.password });
        this.notifyListeners('SIGNED_IN', mockResult.data.session);
        return mockResult;
      }
    }

    const mockResult = await mockAuth.signUp(data);
    await mockAuth.signInWithPassword({ email: data.email, password: data.password });
    this.notifyListeners('SIGNED_IN', mockResult.data.session);
    return mockResult;
  }

  async signOut() {
    localStorage.removeItem('sandbox_session');
    await mockAuth.signOut();
    if (isSupabaseConfigured) {
      if (!supabaseInstance) {
        const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      }
      await supabaseInstance.auth.signOut();
    }
    this.notifyListeners('SIGNED_OUT', null);
    return { error: null };
  }
}

const coexistingAuth = new CoexistingAuthManager();

const mockSupabase = {
  auth: coexistingAuth,
  from: (tableName: string) => new MockSupabaseQueryBuilder(tableName)
};

// Proxied supabase standard client
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const useMock = !isSupabaseConfigured || Boolean(localStorage.getItem('sandbox_session'));
    
    if (prop === 'auth') {
      return coexistingAuth;
    }
    
    if (useMock) {
      return (mockSupabase as any)[prop];
    }
    
    if (!supabaseInstance) {
      const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
    
    return (supabaseInstance as any)[prop];
  }
});

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          stock_quantity: number
          sku: string | null
          image_url: string | null
          category_id: string | null
          created_at: string
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          employee_id: string | null
          total_amount: number
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          payment_status: 'unpaid' | 'paid' | 'refunded'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
    }
  }
}
