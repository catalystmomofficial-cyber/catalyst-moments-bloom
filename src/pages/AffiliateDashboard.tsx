import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Users, Clock, CheckCircle2, DollarSign, Loader2, Sparkles } from "lucide-react";

interface Stats {
  total_referrals: number;
  pending_referrals: number;
  confirmed_referrals: number;
  paid_referrals: number;
  total_earnings_cents: number;
  paid_earnings_cents: number;
}

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("affiliate_status, referral_code, display_name, motherhood_stage, paypal_email")
        .eq("user_id", user.id)
        .maybeSingle();
      setProfile(prof);
      setPaypalEmail((prof as any)?.paypal_email || "");

      const { data: s } = await (supabase as any).rpc("get_affiliate_stats", { p_user_id: user.id });
      if (s && s[0]) setStats(s[0] as Stats);
      setLoading(false);
    })();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-16 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-catalyst-copper" /></div>
      </PageLayout>
    );
  }
  if (!profile || profile.affiliate_status !== "active" || !profile.referral_code) {
    return <Navigate to="/affiliate" replace />;
  }

  const link = `https://catalystmomofficial.com/signup?ref=${profile.referral_code}`;
  const stageRaw = (profile.motherhood_stage || "").toLowerCase();
  const stageLabel =
    stageRaw === "ttc" ? "TTC" :
    stageRaw === "pregnant" ? "pregnancy" :
    stageRaw === "postpartum" ? "postpartum" : "motherhood";

  const igCaption = `Help a mama heal and earn $29. I have been using Catalyst Mom for my ${stageLabel} journey and it has been a game changer. Join using my link and we both win. ${link}`;
  const storyCaption = `Did you know you can earn $29 for every mama you refer to Catalyst Mom? Use my link. ${link}`;
  const waCaption = `Hey mama — I wanted to share something that has genuinely helped me. Catalyst Mom is a wellness app built specifically for TTC, pregnancy, and postpartum. Use my link to join and I earn $29 when you stay for month 2. ${link}`;

  const copy = (text: string, label = "Copied") => {
    navigator.clipboard.writeText(text);
    toast({ title: label });
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Catalyst Mom", text: storyCaption, url: link }); }
      catch {}
    } else { copy(link, "Link copied — paste anywhere"); }
  };

  const saveEmail = async () => {
    setSavingEmail(true);
    const { error } = await supabase
      .from("profiles")
      .update({ paypal_email: paypalEmail } as any)
      .eq("user_id", user.id);
    setSavingEmail(false);
    toast({ title: error ? "Error saving" : "Saved", variant: error ? "destructive" : "default" });
  };

  const earnings = stats ? `$${(stats.total_earnings_cents / 100).toFixed(2)}` : "$0.00";
  const welcome = searchParams.get("welcome");

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        {welcome && (
          <div className="mb-6 p-4 rounded-lg border-2 border-catalyst-copper/30 bg-catalyst-copper/5 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-catalyst-copper" />
            <span className="text-sm font-medium text-catalyst-brown">Welcome to the Partner Program — your link is live below.</span>
          </div>
        )}

        <h1 className="text-3xl font-bold text-catalyst-brown mb-1">Affiliate Dashboard</h1>
        <p className="text-muted-foreground mb-8">Help moms heal. Earn $29 per referral.</p>

        {/* Link */}
        <Card className="mb-6 border-catalyst-copper/30 bg-gradient-to-br from-catalyst-copper/5 to-transparent">
          <CardHeader><CardTitle className="text-catalyst-brown">Your Referral Link</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input readOnly value={link} className="font-mono text-sm" onClick={(e) => (e.target as HTMLInputElement).select()} />
              <Button onClick={() => copy(link, "Link copied")} className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button variant="outline" onClick={share}><Share2 className="h-4 w-4 mr-1" /> Share</Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<Users className="h-4 w-4" />} label="Total referrals" value={stats?.total_referrals ?? 0} />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Pending" value={stats?.pending_referrals ?? 0} />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Confirmed" value={stats?.confirmed_referrals ?? 0} />
          <StatCard icon={<DollarSign className="h-4 w-4" />} label="Total earnings" value={earnings} highlight />
        </div>

        {/* PayPal email */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Payout Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="paypal">PayPal email</Label>
            <div className="flex gap-2">
              <Input id="paypal" type="email" placeholder="you@paypal.com" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} />
              <Button onClick={saveEmail} disabled={savingEmail || !paypalEmail} className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                {savingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">We send payouts here once your referral is confirmed.</p>
          </CardContent>
        </Card>

        {/* Share Tools */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Share Tools</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <CaptionBlock label="Instagram caption" text={igCaption} onCopy={() => copy(igCaption, "Instagram caption copied")} />
            <CaptionBlock label="Story caption" text={storyCaption} onCopy={() => copy(storyCaption, "Story caption copied")} />
            <CaptionBlock label="WhatsApp caption" text={waCaption} onCopy={() => copy(waCaption, "WhatsApp caption copied")} />
          </CardContent>
        </Card>

        {/* Rules */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Program Rules</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <RuleItem title="2nd Month Lock" body="You earn $29 after your referral completes their second month." />
            <RuleItem title="7-Day Buffer" body="Payout processes 7 days after second payment clears." />
            <RuleItem title="Active Status Required" body="You must have an active subscription to receive payouts." />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: any; highlight?: boolean }) {
  return (
    <Card className={highlight ? "border-catalyst-copper/40 bg-catalyst-copper/5" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">{icon}<span>{label}</span></div>
        <div className={`text-2xl font-bold ${highlight ? "text-catalyst-copper" : "text-catalyst-brown"}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function CaptionBlock({ label, text, onCopy }: { label: string; text: string; onCopy: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label className="text-xs">{label}</Label>
        <Button size="sm" variant="ghost" onClick={onCopy}><Copy className="h-3 w-3 mr-1" /> Copy</Button>
      </div>
      <div className="p-3 rounded-md bg-muted text-sm whitespace-pre-wrap leading-relaxed">{text}</div>
    </div>
  );
}

function RuleItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <Badge variant="outline" className="border-catalyst-copper/40 text-catalyst-copper shrink-0">●</Badge>
      <div>
        <div className="font-semibold text-catalyst-brown">{title}</div>
        <div className="text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}
