-- Add new columns if they do not exist
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS nism VARCHAR(30);
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS jumlah_nilai NUMERIC(10,2);

-- Drop old unique constraints if any
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_no_peserta_key;
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_nisn_key;
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_nism_key;

-- Add new unique constraints
ALTER TABLE public.students ADD CONSTRAINT students_no_peserta_key UNIQUE (no_peserta);
ALTER TABLE public.students ADD CONSTRAINT students_nism_key UNIQUE (nism);
ALTER TABLE public.students ADD CONSTRAINT students_nisn_key UNIQUE (nisn);
