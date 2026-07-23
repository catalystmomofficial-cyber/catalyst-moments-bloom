import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Gavel, Clock, ClipboardList, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

// Admin-only "Dispute Response" helper. When a Stripe chargeback comes in, this
// is where the team reaches for the evidence pack. You fill in the member's
// facts, it assembles a ready-to-paste response for Stripe's dispute form, and
// it lists exactly what to attach and where to grab each piece. It does not talk
// to Stripe or Supabase; the facts are typed in by hand so nothing here can be
// wrong about a member. Everything it states matches our real, published policy
// (30-day fair-try guarantee, terms at /terms#refunds).

const evidenceChecklist = [
  {
    item: 'Proof they agreed to the refund policy at checkout',
    where:
      'Screenshot catalystmomofficial.com/terms#refunds and the checkout screen showing the policy link above the pay button.',
  },
  {
    item: 'Payment receipt',
    where: 'Stripe usually attaches this automatically. Confirm it is included in the dispute submission.',
  },
  {
    item: 'Proof the account was created and used',
    where:
      'Supabase → Authentication (or the profiles table): the member\'s signup date and any recent activity / last sign-in.',
  },
  {
    item: 'Subscription status',
    where: 'Stripe → Customers → this customer → their subscription (active, or when it was cancelled).',
  },
  {
    item: 'Any emails with the customer',
    where: 'Your admin@catalystmom.online inbox. A support thread showing you offered help is strong evidence.',
  },
];

const DisputeResponseSection = () => {
  const [memberName, setMemberName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [signupDate, setSignupDate] = useState('');
  const [lastActive, setLastActive] = useState('');

  const narrative = useMemo(() => {
    const name = memberName.trim() || '[member name]';
    const mail = email.trim() || '[member email]';
    const planText = plan.trim() || '[plan]';
    const amt = amount.trim() || '[amount]';
    const signup = signupDate.trim() || '[signup date]';
    const active = lastActive.trim() || '[last active date]';

    return `To Whom It May Concern,

This charge is for a valid, active Catalyst Mom subscription (${planText}) purchased by ${name} (${mail}) on ${signup} for ${amt}.

At checkout, the customer reviewed and agreed to our published refund and cancellation policy, which is shown and linked before payment is taken (https://catalystmomofficial.com/terms#refunds). That policy is a 30-day money-back guarantee: any member who gives the program a genuine try and finds it is not right for them within their first 30 days can email us for a refund, and we honor those requests. This customer did not contact us to request a refund under that policy before filing this dispute.

The customer created an account and accessed the paid membership. Our account records show activity on ${active}. The product was delivered and used as described at the time of purchase.

We remain willing to resolve this directly, and our refund process is simple and was clearly disclosed and agreed to before payment. We respectfully ask that this dispute be resolved in our favor.

Attached: proof of the agreed terms, the signup and payment record, and the customer's account access log.

Sincerely,
Catalyst Mom
admin@catalystmom.online`;
  }, [memberName, email, plan, amount, signupDate, lastActive]);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Could not copy. Select the text and copy manually.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" />
            <CardTitle>Dispute Response</CardTitle>
          </div>
          <CardDescription>
            When a Stripe chargeback comes in, use this to submit your evidence. It does not connect to
            Stripe; you fill in the member's details and it builds the response you paste into Stripe's
            dispute form.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-foreground">You are on a deadline.</p>
              <p className="text-muted-foreground">
                Stripe gives you a fixed window (often about 7 to 21 days depending on the card network) to
                respond. If you miss it, the dispute is lost automatically. Find it in{' '}
                <span className="font-medium">Stripe Dashboard → Disputes</span> and note the due date first.
              </p>
              <p className="mt-2 text-muted-foreground">
                Decide up front: if you would rather just give the money back, issue a normal refund and move
                on. Only submit the response below when you believe the charge is legitimate and want to
                contest it.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Fill in the member's details</CardTitle>
          <CardDescription>
            Look these up in Stripe and Supabase, then type them here. Leave anything blank and it stays as a
            clearly-marked placeholder you can fix before submitting.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="d-name">Member name</Label>
            <Input id="d-name" value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-email">Member email</Label>
            <Input id="d-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-plan">Plan</Label>
            <Input id="d-plan" value={plan} onChange={(e) => setPlan(e.target.value)} placeholder="Monthly / Annual founding seat" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-amount">Amount charged</Label>
            <Input id="d-amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$29.00" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-signup">Signup / purchase date</Label>
            <Input id="d-signup" value={signupDate} onChange={(e) => setSignupDate(e.target.value)} placeholder="Mar 3, 2026" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-active">Last active date</Label>
            <Input id="d-active" value={lastActive} onChange={(e) => setLastActive(e.target.value)} placeholder="Mar 24, 2026" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">2. Your response</CardTitle>
            <CardDescription>Review it, edit anything, then copy and paste it into Stripe's dispute form.</CardDescription>
          </div>
          <Button size="sm" onClick={() => copy(narrative, 'Response')} className="shrink-0">
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea readOnly value={narrative} className="min-h-[320px] font-mono text-xs leading-relaxed" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">3. What to attach, and where to get it</CardTitle>
          </div>
          <CardDescription>
            Stripe's form lets you upload supporting files. Attach as many of these as you can.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {evidenceChecklist.map((row, i) => (
            <div key={row.item}>
              {i > 0 && <Separator className="mb-3" />}
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5 shrink-0">{i + 1}</Badge>
                <div>
                  <p className="font-medium text-foreground">{row.item}</p>
                  <p className="text-sm text-muted-foreground">{row.where}</p>
                </div>
              </div>
            </div>
          ))}
          <Separator />
          <a
            href="https://dashboard.stripe.com/disputes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Open Stripe Disputes
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisputeResponseSection;
