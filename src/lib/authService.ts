import { supabase } from './supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

// Types
export type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};

// Login with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      return { user: null, session: null, error };
    }

    return { 
      user: data?.user || null, 
      session: data?.session || null, 
      error: null 
    };
  } catch (err) {
    console.error('Unexpected error during login:', err);
    return { 
      user: null, 
      session: null, 
      error: new AuthError('An unexpected error occurred during login') 
    };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Signup error:', error.message);
      return { user: null, session: null, error };
    }

    return { 
      user: data?.user || null, 
      session: data?.session || null, 
      error: null 
    };
  } catch (err) {
    console.error('Unexpected error during signup:', err);
    return { 
      user: null, 
      session: null, 
      error: new AuthError('An unexpected error occurred during signup') 
    };
  }
};

// Sign out
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error.message);
      return { error };
    }
    
    return { error: null };
  } catch (err) {
    console.error('Unexpected error during logout:', err);
    return { error: new AuthError('An unexpected error occurred during logout') };
  }
};

// Get current session
export const getCurrentSession = async (): Promise<{ session: Session | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Get session error:', error.message);
      return { session: null, error };
    }
    
    return { session: data?.session || null, error: null };
  } catch (err) {
    console.error('Unexpected error getting session:', err);
    return { session: null, error: new AuthError('An unexpected error occurred while getting session') };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get user error:', error.message);
      return { user: null, error };
    }
    
    return { user: data?.user || null, error: null };
  } catch (err) {
    console.error('Unexpected error getting user:', err);
    return { user: null, error: new AuthError('An unexpected error occurred while getting user') };
  }
};

// Password reset request
export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Password reset error:', error.message);
      return { error };
    }
    
    return { error: null };
  } catch (err) {
    console.error('Unexpected error during password reset:', err);
    return { error: new AuthError('An unexpected error occurred during password reset') };
  }
};

// Auth state change listener
export const onAuthStateChange = (
  callback: (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'PASSWORD_RECOVERY' | 'INITIAL_SESSION', session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event as any, session);
  });
};
