CREATE TABLE public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  plant TEXT NOT NULL,
  disease TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Healthy',
  confidence NUMERIC NOT NULL DEFAULT 0,
  symptoms TEXT[] NOT NULL DEFAULT '{}',
  treatment TEXT[] NOT NULL DEFAULT '{}',
  prevention TEXT[] NOT NULL DEFAULT '{}',
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX scans_created_at_idx ON public.scans (created_at DESC);

GRANT SELECT, INSERT, DELETE ON public.scans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scans TO authenticated;
GRANT ALL ON public.scans TO service_role;

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scans" ON public.scans FOR SELECT USING (true);
CREATE POLICY "Anyone can create scans" ON public.scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete scans" ON public.scans FOR DELETE USING (true);