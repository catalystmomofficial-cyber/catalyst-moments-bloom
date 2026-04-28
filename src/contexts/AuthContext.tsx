import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type MotherhoodStage = "ttc" | "pregnant" | "postpartum" | "toddler" | "none";

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  motherhood_stage: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  subscribed: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  isCheckingSubscription: boolean;
  showCheckoutModal: boolean;
  setShowCheckoutModal: (show: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, stage: MotherhoodStage, referralCode?: string | null) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { display_name?: string; motherhood_stage?: string; bio?: string; avatar_url?: string }) => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState<boolean>(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Fetch user profile from the profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Ensure a profile row exists for the authenticated user (used for Google signups and first logins)
  const ensureProfile = async (u: User) => {
    try {
      const { data: existing, error: selErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', u.id)
        .maybeSingle();

      if (selErr && selErr.code !== 'PGRST116') {
        console.error('Error checking profile existence:', selErr);
        return;
      }

      if (!existing) {
        const { data: inserted, error: insErr } = await supabase
          .from('profiles')
          .insert({
            user_id: u.id,
            display_name: (u.user_metadata as any)?.full_name ?? null,
            motherhood_stage: (u.user_metadata as any)?.motherhood_stage ?? 'none',
            referred_by_code: (u.user_metadata as any)?.referral_code ?? null,
          })
          .select('*')
          .single();

        if (insErr) {
          console.error('Error creating profile:', insErr);
          return;
        }

        setProfile(inserted as UserProfile);
      }
    } catch (err) {
      console.error('ensureProfile error:', err);
    }
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid potential deadlocks
          setTimeout(() => {
            (async () => {
              await ensureProfile(session.user!);
              await fetchProfile(session.user!.id);
              checkSubscription();
            })();
          }, 0);
        } else {
          setProfile(null);
          setSubscribed(false);
          setSubscriptionTier(null);
          setSubscriptionEnd(null);
        }
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setSubscribed(false);
          setSubscriptionTier(null);
          setSubscriptionEnd(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Use setTimeout for consistency and to avoid race conditions
        setTimeout(() => {
          (async () => {
            await ensureProfile(session.user!);
            await fetchProfile(session.user!.id);
            checkSubscription();
          })();
        }, 0);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success("Logged in successfully!");
      // Check subscription after login
      checkSubscription();
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, stage: MotherhoodStage, referralCode?: string | null) => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
            full_name: name,
            motherhood_stage: stage,
            ...(referralCode && { referral_code: referralCode })
          }
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Registration successful! Please check your email to verify your account.");
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error during logout");
      throw error;
    }
  };

  const updateProfile = async (data: { display_name?: string; motherhood_stage?: string; bio?: string }) => {
    if (!user) {
      throw new Error("Not authenticated");
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Refresh profile data
      await fetchProfile(user.id);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : "Profile update failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!session) {
      setIsCheckingSubscription(false);
      return;
    }

    setIsCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      setSubscribed(data.subscribed || false);
      setSubscriptionTier(data.subscription_tier || null);
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!session?.user,
    subscribed,
    subscriptionTier,
    subscriptionEnd,
    isCheckingSubscription,
    showCheckoutModal,
    setShowCheckoutModal,
    login,
    register,
    logout,
    updateProfile,
    checkSubscription
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};