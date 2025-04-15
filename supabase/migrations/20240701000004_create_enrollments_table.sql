CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) NOT NULL,
  course_id UUID REFERENCES courses(id) NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  fee_paid NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter publication supabase_realtime add table enrollments;
