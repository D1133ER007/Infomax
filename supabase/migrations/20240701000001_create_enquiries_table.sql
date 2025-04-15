CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id TEXT NOT NULL,
  registered_id TEXT,
  enquiry_date DATE NOT NULL,
  start_date DATE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  contact_no TEXT NOT NULL,
  email TEXT NOT NULL,
  academic_qualification TEXT,
  technical_qualification TEXT,
  occupation TEXT,
  guardian_name TEXT,
  guardian_occupation TEXT,
  guardian_contact TEXT,
  temporary_address TEXT,
  permanent_address TEXT,
  enrolled_course TEXT,
  time_preferred TEXT,
  scheme_name TEXT,
  course_fee NUMERIC DEFAULT 0,
  net_course_fee NUMERIC DEFAULT 0,
  scheme_offered BOOLEAN DEFAULT false,
  discount_given TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter publication supabase_realtime add table enquiries;
