import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// These environment variables should be set in your .env file with VITE_ prefix
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Error handling wrapper for Supabase queries
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }
    
    if (data === null) {
      return [] as unknown as T;
    }
    
    return data;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}
