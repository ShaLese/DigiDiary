import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  status?: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export async function signUp(email: string, password: string, fullName: string): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    // Sign up the user with email confirmation disabled for now
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      },
    });

    if (error) throw error;

    if (data?.user) {
      // Create user profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            email: data.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      // Return success with email confirmation message
      return { 
        user: data.user, 
        error: data.user.identities?.length === 0 ? {
          message: 'Email already registered. Please check your email for the confirmation link.',
          status: 400
        } : null 
      };
    }

    return { user: null, error: { message: 'Signup failed', status: 400 } };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      user: null,
      error: {
        message: error.message || 'An error occurred during sign up',
        status: error.status,
      },
    };
  }
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    let errorMessage = error.message;
    
    // Provide more user-friendly error messages
    if (error.message?.includes('Email not confirmed')) {
      errorMessage = 'Please confirm your email address before signing in. Check your inbox for the confirmation link.';
    } else if (error.message?.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password. Please try again.';
    }

    return {
      user: null,
      error: {
        message: errorMessage,
        status: error.status,
      },
    };
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return {
      error: {
        message: error.message || 'Error signing out',
        status: error.status,
      },
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { profile: data, error: null };
  } catch (error: any) {
    console.error('Get user profile error:', error);
    return {
      profile: null,
      error: {
        message: error.message || 'Error getting user profile',
        status: error.status,
      },
    };
  }
}

export async function updateProfile(userId: string, updates: { full_name?: string; avatar_url?: string }): Promise<{ profile: UserProfile | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { profile: data, error: null };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return {
      profile: null,
      error: {
        message: error.message || 'Error updating profile',
        status: error.status,
      },
    };
  }
}

// Setup auth state change listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
}
