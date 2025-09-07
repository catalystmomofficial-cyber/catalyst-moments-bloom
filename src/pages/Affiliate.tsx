import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Copy, DollarSign, Users, TrendingUp, Star, Link2, Share2, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AffiliateSignupModal from "@/components/affiliate/AffiliateSignupModal";
import { DashboardCard } from "@/components/admin/DashboardCard";

export default function Affiliate() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [referralCode] = useState(() => {
    // Generate unique referral code: MOM + username/email prefix + 35, max 12 chars
    const userId = user?.email?.split('@')[0] || user?.id?.slice(0, 4) || 'USER';
    const prefix = userId.toUpperCase().slice(0, 5);
    return `MOM${prefix}35`.slice(0, 12);
  });
  const [earnings] = useState(8547.50);
  const [referrals] = useState(187);
  const [conversionRate] = useState(24.8);
  const [affiliateStatus, setAffiliateStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    if (user) {
      checkAffiliateStatus();
    } else {
      // For guest users, set status to 'none' to show signup form
      setAffiliateStatus('none');
      setIsLoading(false);
    }
  }, [user]);

  const checkAffiliateStatus = async () => {
    if (!user) {
      setAffiliateStatus('none');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .rpc('get_affiliate_status', { user_id_param: user?.id });

      if (error) {
        console.error('Error checking affiliate status:', error);
        setAffiliateStatus('none');
      } else if (data && data.length > 0) {
        setAffiliateStatus(data[0].status);
      } else {
        setAffiliateStatus('none');
      }
    } catch (error) {
      console.error('Error:', error);
      setAffiliateStatus('none');
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const copyReferralLink = () => {
    const link = `https://catalystmom.lovable.app/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (affiliateStatus === 'none' || affiliateStatus === 'rejected') {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 space-y-8">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">
              Join Catalyst Moms—Empower Moms, <span className="text-2xl font-bold" style={{fontSize: '24px'}}>Earn $35 Per Sale!</span>
            </h1>
            
            <Card className="p-8">
              <div className="space-y-6">
                <p className="text-center text-muted-foreground">
                  Why Join? Help moms glow up, share real stories, and earn a flat $35 every time someone signs up or buys—subscription, course, or meal plan. Get templates, reels, and links to make it easy.
                </p>
                
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={() => setIsSignupOpen(true)}
                >
                  Apply to Become an Affiliate
                </Button>
                
                {affiliateStatus === 'rejected' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="h-5 w-5" />
                      <span className="font-medium">Application was not approved</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      You can apply again with updated information.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          <AffiliateSignupModal 
            isOpen={isSignupOpen} 
            onClose={() => setIsSignupOpen(false)} 
          />
        </div>
      </PageLayout>
    );
  }

  if (affiliateStatus === 'pending') {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 space-y-8">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold">Application Under Review</h1>
            
            <Card className="p-8">
              <div className="space-y-6 text-center">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-yellow-700 mb-2">
                    <Clock className="h-6 w-6" />
                    <span className="font-medium">Review in Progress</span>
                  </div>
                  <p className="text-yellow-600">
                    We're reviewing your affiliate application. You'll receive an email within 24 hours with our decision.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">What happens next?</h3>
                  <ul className="text-left space-y-2 max-w-md mx-auto">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Application submitted</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Under review (within 24 hours)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Email notification sent</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Access to affiliate dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Approved affiliate dashboard
  return (
    <PageLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold" style={{fontSize: '24px'}}>
            Earn $35 Per Sale—Every Subscription, Course, or Meal Plan!
          </h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="Total Earnings"
            value={`$${earnings.toLocaleString()}`}
            subtitle="Commission earned"
            colors={["#10B981", "#34D399", "#6EE7B7"]}
            delay={0.1}
          >
            <DollarSign className="h-8 w-8 text-green-500" />
          </DashboardCard>
          
          <DashboardCard
            title="Active Referrals"
            value={referrals}
            subtitle="People you've referred"
            colors={["#3B82F6", "#60A5FA", "#93C5FD"]}
            delay={0.2}
          >
            <Users className="h-8 w-8 text-blue-500" />
          </DashboardCard>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tools">Marketing Tools</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Referral Code Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Your Referral Code
                </CardTitle>
                <CardDescription>
                  Share this code with friends to earn commissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={referralCode} readOnly className="font-mono" />
                  <Button onClick={copyReferralCode} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={`https://catalystmom.lovable.app/signup?ref=${referralCode}`} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button onClick={copyReferralLink} variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sarah M.", action: "Joined Premium", earnings: "$129.00", date: "2 hours ago" },
                    { name: "Jessica L.", action: "Purchased Course", earnings: "$87.00", date: "1 day ago" },
                    { name: "Maria K.", action: "Joined Premium", earnings: "$129.00", date: "3 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{activity.earnings}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Templates</CardTitle>
                  <CardDescription>Ready-to-use content for your posts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    placeholder="🌟 Transform your postpartum journey with Glow & Go! Join me and get amazing results. Use my code: GLOW2024 ✨"
                    rows={3}
                  />
                  <Button className="w-full" variant="outline">Copy Template</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Banner Images</CardTitle>
                  <CardDescription>Professional graphics for your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                      Square Banner
                    </div>
                    <div className="aspect-video bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                      Story Banner
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">Download All</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">$2,879.50</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Last Month</span>
                    <span className="font-semibold">$5,668.00</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Earnings</span>
                    <span className="text-xl font-bold text-green-600">${earnings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">PayPal Email</label>
                  <Input placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Payout</label>
                  <Input value="$50.00" readOnly />
                </div>
                <Button>Update Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Share your personal transformation story</li>
                    <li>• Post consistently across social platforms</li>
                    <li>• Engage authentically with your audience</li>
                    <li>• Use high-quality visuals and videos</li>
                    <li>• Be transparent about affiliate partnerships</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commission Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-primary mb-2">$35</div>
                    <p className="text-muted-foreground">
                      Earn $35 per sale, every single time, for any subscription, course, or meal plan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}