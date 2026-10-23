import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

// Safe Supabase client initialization (fallback to dummy url if not configured)
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key'
);

/**
 * Upload document/file to Supabase Storage Bucket
 * @param bucket 'documents' or 'profiles'
 * @param path File path e.g. 'marksheets/application-123.pdf'
 * @param file File object or Blob
 */
export const uploadFileToSupabase = async (
  bucket: string,
  path: string,
  file: File | Blob
): Promise<{ url: string | null; error: Error | null }> => {
  if (!isSupabaseConfigured()) {
    return { url: null, error: new Error('Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env') };
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      });

    if (error) {
      return { url: null, error };
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: urlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err };
  }
};
