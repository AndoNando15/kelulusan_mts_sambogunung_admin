-- Supabase (PostgreSQL) schema for students table
-- Run this in the Supabase SQL editor to create the necessary table
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  no_peserta varchar(50) NOT NULL,
  nisn varchar(20) NOT NULL,
  nama varchar(100) NOT NULL,
  jk varchar(20) NOT NULL, -- gender
  keterangan varchar(20) NOT NULL, -- e.g., 'LULUS' or 'TIDAK LULUS'
  rata_rata numeric(5,2) NOT NULL, -- average score
  created_at timestamp with time zone DEFAULT now()
);

-- Optional: index on nisn for faster lookup
CREATE INDEX IF NOT EXISTS idx_students_nisn ON public.students (nisn);

-- Sample data (optional, can be removed if not needed)
INSERT INTO public.students (no_peserta, nisn, nama, jk, keterangan, rata_rata) VALUES
  ('001', '1234567890', 'Ahmad Fauzi', 'Laki-laki', 'LULUS', 85.5),
  ('002', '0987654321', 'Siti Nurhaliza', 'Perempuan', 'TIDAK LULUS', 68.2),
  ('003', '1122334455', 'Budi Santoso', 'Laki-laki', 'LULUS', 91.0),
  ('004', '2233445566', 'Herlando Prayitnooo', 'Laki-laki', 'LULUS', 71.0),
  ('005', '3344556677', 'Dewi Lestari', 'Perempuan', 'LULUS', 88.4),
  ('006', '4455667788', 'Rizky Ramadhan', 'Laki-laki', 'TIDAK LULUS', 64.7),
  ('007', '5566778899', 'Aulia Rahman', 'Perempuan', 'LULUS', 79.9),
  ('008', '6677889900', 'Fajar Nugroho', 'Laki-laki', 'LULUS', 83.1),
  ('009', '7788990011', 'Nabila Putri', 'Perempuan', 'TIDAK LULUS', 69.5),
  ('010', '8899001122', 'Yoga Pratama', 'Laki-laki', 'LULUS', 87.3);
