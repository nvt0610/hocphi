-- Database Schema for HocPhi Project (Refined)
-- Note: Using UUID for IDs as per current implementation

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10),
    date_of_birth DATE,
    address TEXT,
    phone_number VARCHAR(15),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    monthly_fee DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Class Schedules
CREATE TABLE IF NOT EXISTS class_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 2 AND 8), -- 2: Thứ 2, ..., 8: Chủ nhật
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id)
);

-- 6. Tuition Records
CREATE TABLE IF NOT EXISTS tuition_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    billing_month VARCHAR(7), -- YYYY-MM
    content TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'Unpaid' CHECK (status IN ('Paid', 'Unpaid')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_students_name ON students(full_name);
CREATE INDEX IF NOT EXISTS idx_tuition_student ON tuition_records(student_id);
CREATE INDEX IF NOT EXISTS idx_schedules_class_day ON class_schedules(class_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);