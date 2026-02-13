
-- Payroll records table
CREATE TABLE public.payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  base_salary NUMERIC NOT NULL DEFAULT 0,
  bonus NUMERIC NOT NULL DEFAULT 0,
  overtime_hours NUMERIC NOT NULL DEFAULT 0,
  overtime_rate NUMERIC NOT NULL DEFAULT 1.5,
  overtime_value NUMERIC NOT NULL DEFAULT 0,
  attendance_bonus NUMERIC NOT NULL DEFAULT 0,
  inss_discount NUMERIC NOT NULL DEFAULT 0,
  irrf_discount NUMERIC NOT NULL DEFAULT 0,
  vt_discount NUMERIC NOT NULL DEFAULT 0,
  vr_discount NUMERIC NOT NULL DEFAULT 0,
  other_discounts NUMERIC NOT NULL DEFAULT 0,
  other_discounts_description TEXT,
  gross_salary NUMERIC NOT NULL DEFAULT 0,
  net_salary NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(employee_id, month, year)
);

-- Enable RLS
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own payroll records"
ON public.payroll_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payroll records"
ON public.payroll_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payroll records"
ON public.payroll_records FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payroll records"
ON public.payroll_records FOR DELETE
USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_payroll_records_updated_at
BEFORE UPDATE ON public.payroll_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
