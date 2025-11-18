import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth, MotherhoodStage } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { UserPlus, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { PersonalizedOnboarding } from "@/components/onboarding/PersonalizedOnboarding";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [motherhoodStage, setMotherhoodStage] = useState<MotherhoodStage>("none");
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Read URL parameters on mount
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const refParam = searchParams.get('ref');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (refParam) {
      setReferralCode(refParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    try {
      await register(name, email, password, motherhoodStage, referralCode);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register");
    }
  };

  const handleStageChange = (value: string) => {
    setMotherhoodStage(value as MotherhoodStage);
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");
    
    try {
      // Include referral code in redirect URL if present
      const redirectUrl = referralCode 
        ? `${window.location.origin}/?ref=${referralCode}`
        : `${window.location.origin}/`;
        
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up with Google");
      setGoogleLoading(false);
    }
  };

  return (
    <PageLayout>
      <PersonalizedOnboarding />
      <div className="flex items-center justify-center py-10">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Join the Catalyst Mom community today</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherhood-stage">Motherhood Stage</Label>
                  <Select onValueChange={handleStageChange} defaultValue={motherhoodStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ttc">Trying to Conceive</SelectItem>
                      <SelectItem value="pregnant">Pregnant</SelectItem>
                      <SelectItem value="postpartum">Postpartum (0-12 months)</SelectItem>
                      <SelectItem value="toddler">Toddler Mom</SelectItem>
                      <SelectItem value="none">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-catalyst-copper hover:bg-catalyst-copper/90"
                  disabled={isLoading || googleLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>

                <div className="relative my-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                    OR
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignup}
                  disabled={isLoading || googleLoading}
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M21.35 11.1h-9.18v2.96h5.27c-.23 1.5-1.62 4.4-5.27 4.4-3.17 0-5.76-2.63-5.76-5.87s2.59-5.87 5.76-5.87c1.81 0 3.01.76 3.7 1.41l2.53-2.45C16.58 3.82 14.49 3 12.17 3 6.96 3 2.69 7.27 2.69 12.49s4.27 9.49 9.48 9.49c5.49 0 9.1-3.85 9.1-9.26 0-.62-.07-1.09-.19-1.62z"/>
                        <path fill="#34A853" d="M12.17 21.98c3.45 0 6.34-2.29 7.38-5.51l-3.52-2.73c-.95 2.85-3.43 3.54-3.86 3.54-2.3 0-4.26-1.55-4.96-3.62l-3.58 2.78c1.36 3.1 4.47 5.54 8.54 5.54z"/>
                        <path fill="#FBBC05" d="M7.21 13.66a5.58 5.58 0 010-3.74L3.63 7.14a9.45 9.45 0 000 9.69l3.58-3.17z"/>
                        <path fill="#EA4335" d="M12.17 6.12c1.87 0 3.12.81 3.84 1.49l2.61-2.53C17.94 3.78 16 3 12.17 3 8.1 3 4.99 5.44 3.63 8.54l3.58 3.38c.69-2.07 2.65-3.8 4.96-3.8z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Register;