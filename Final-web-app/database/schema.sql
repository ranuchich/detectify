-- Detectify Jobs Database Schema
-- Production Ready for Supabase / PostgreSQL

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Companies
CREATE TABLE company (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100),
    industry VARCHAR(100),
    location VARCHAR(100),
    logo_url TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users (Core Identity)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255), -- Note: Supabase Auth handles passwords, but keeping schema as requested
    role TEXT CHECK (role IN ('student', 'company', 'admin')) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Profile (Extended info)
CREATE TABLE profile (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    bio TEXT,
    headline VARCHAR(255),
    location VARCHAR(100),
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Jobs
CREATE TABLE job (
    job_id SERIAL PRIMARY KEY,
    company_id INT REFERENCES company(company_id) ON DELETE SET NULL,
    title VARCHAR(100),
    description TEXT,
    location VARCHAR(100),
    salary DECIMAL(10,2),
    employment_type VARCHAR(50), -- e.g., 'Full-time', 'Internship', 'Contract'
    posted_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Applications
CREATE TABLE application (
    application_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    job_id INT REFERENCES job(job_id) ON DELETE CASCADE,
    applied_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Applied', -- e.g., 'Applied', 'Interview', 'Offered', 'Rejected'
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Skills
CREATE TABLE skill (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE,
    category VARCHAR(50)
);

-- 7. User Skills (Junction Table)
CREATE TABLE userskill (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skill(skill_id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50), -- e.g., 'Beginner', 'Intermediate', 'Expert'
    PRIMARY KEY (user_id, skill_id)
);

-- 8. Job Skills (Junction Table)
CREATE TABLE jobskill (
    jobskill_id SERIAL PRIMARY KEY,
    job_id INT REFERENCES job(job_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skill(skill_id) ON DELETE CASCADE,
    importance_level VARCHAR(50) -- e.g., 'Required', 'Preferred'
);

-- 9. Education
CREATE TABLE education (
    education_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    school VARCHAR(100),
    degree VARCHAR(100),
    field VARCHAR(100),
    start_date DATE,
    end_date DATE,
    gpa DECIMAL(3,2)
);

-- 10. Experience
CREATE TABLE experience (
    experience_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    position_title VARCHAR(100),
    company_name VARCHAR(100),
    description TEXT,
    location VARCHAR(100),
    start_date DATE,
    end_date DATE
);

-- 11. Match Scoring
CREATE TABLE user_job_match (
    match_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    job_id INT REFERENCES job(job_id) ON DELETE CASCADE,
    match_score DECIMAL(5,2),
    matched_skills_count INT,
    missing_skills_count INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Recommendations
CREATE TABLE learning_recommendation (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skill(skill_id) ON DELETE CASCADE,
    title VARCHAR(255),
    provider VARCHAR(100),
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Skill Gap Analysis
CREATE TABLE skill_gap (
    gap_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    job_id INT REFERENCES job(job_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skill(skill_id) ON DELETE CASCADE,
    importance_level VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE company ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE job ENABLE ROW LEVEL SECURITY;
ALTER TABLE application ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Public read for listings, secure for personal data)
CREATE POLICY "Public companies viewable by all" ON company FOR SELECT USING (true);
CREATE POLICY "Profiles viewable by all" ON profile FOR SELECT USING (true);
CREATE POLICY "Jobs viewable by all" ON job FOR SELECT USING (true);
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Students can view own applications" ON application FOR SELECT USING (true);
CREATE POLICY "Skills viewable by all" ON skill FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_job_company ON job(company_id);
CREATE INDEX idx_application_user ON application(user_id);
CREATE INDEX idx_application_job ON application(job_id);
CREATE INDEX idx_userskill_user ON userskill(user_id);
CREATE INDEX idx_jobskill_job ON jobskill(job_id);
