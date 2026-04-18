-- Fix numeric scales
ALTER TABLE classes ALTER COLUMN monthly_fee TYPE DECIMAL(10, 2);
ALTER TABLE tuition_records ALTER COLUMN amount TYPE DECIMAL(10, 2);

-- Add missing constraints
-- users table role check
DO $$ BEGIN
    ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'staff'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- class_schedules table day_of_week check
DO $$ BEGIN
    ALTER TABLE class_schedules ADD CONSTRAINT class_schedules_day_of_week_check CHECK (day_of_week BETWEEN 2 AND 8);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Fix indexes
-- Drop auto-generated single indexes for schedules
DROP INDEX IF EXISTS "IDX_8311cc83d9350de70f2a77e8c5";
DROP INDEX IF EXISTS "IDX_dce47b7f9b915c560a6f093992";

-- Create specific indexes from docs/db.sql
CREATE INDEX IF NOT EXISTS idx_students_name ON students(full_name);
CREATE INDEX IF NOT EXISTS idx_tuition_student ON tuition_records(student_id);
CREATE INDEX IF NOT EXISTS idx_schedules_class_day ON class_schedules(class_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
