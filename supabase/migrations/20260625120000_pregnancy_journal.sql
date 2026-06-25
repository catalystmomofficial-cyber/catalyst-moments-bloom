-- Pregnancy journal entries (user-owned, persisted)
CREATE TABLE public.pregnancy_journal_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    week INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    mood INTEGER CHECK (mood >= 1 AND mood <= 10),
    milestone TEXT,
    weight DECIMAL(5,1),
    baby_kicks INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.pregnancy_journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journal entries"
ON public.pregnancy_journal_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
ON public.pregnancy_journal_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
ON public.pregnancy_journal_entries
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
ON public.pregnancy_journal_entries
FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_pregnancy_journal_entries_updated_at
    BEFORE UPDATE ON public.pregnancy_journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Private storage bucket for journal photos, user-scoped by folder path
INSERT INTO storage.buckets (id, name, public)
VALUES ('journal-photos', 'journal-photos', false);

CREATE POLICY "Users can view their own journal photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'journal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own journal photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'journal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own journal photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'journal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own journal photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'journal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
