
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, MotherhoodStage } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { Loader2, Save, LogOut, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, logout, updateProfile, isLoading, isAuthenticated } = useAuth();

  const [name, setName] = useState(profile?.display_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [motherhoodStage, setMotherhoodStage] = useState<MotherhoodStage>((profile?.motherhood_stage as MotherhoodStage) || "none");
  const [bio, setBio] = useState(profile?.bio || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleStageChange = (value: string) => {
    setMotherhoodStage(value as MotherhoodStage);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        display_name: name,
        motherhood_stage: motherhoodStage,
        bio
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image Section */}
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle className="text-xl">Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="" alt={profile?.display_name || 'User'} />
                <AvatarFallback className="text-2xl bg-primary/20">
                  {profile?.display_name ? getInitials(profile.display_name) : user?.email?.[0]?.toUpperCase() || "CM"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Upload Photo
              </Button>
            </CardContent>
          </Card>

          {/* Profile Details Section */}
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle className="text-xl">Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>Profile updated successfully!</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="motherhood-stage">Motherhood Stage</Label>
                    <Select 
                      value={motherhoodStage} 
                      onValueChange={handleStageChange}
                    >
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
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself..."
                      className="h-24"
                    />
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                    
                    <Button 
                      type="submit" 
                      className="bg-catalyst-copper hover:bg-catalyst-copper/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
