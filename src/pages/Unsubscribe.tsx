import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertTriangle, MailX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State =
  | 'validating'
  | 'ready'
  | 'already'
  | 'invalid'
  | 'submitting'
  | 'success'
  | 'error';

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState<State>('validating');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }
    const validate = async () => {
      try {
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: supabaseAnonKey } }
        );
        const data = await res.json();
        if (!res.ok) {
          setState('invalid');
          setErrorMsg(data?.error ?? 'Invalid or expired link.');
          return;
        }
        if (data.valid === false && data.reason === 'already_unsubscribed') {
          setState('already');
          return;
        }
        if (data.valid === true) {
          setState('ready');
          return;
        }
        setState('invalid');
      } catch (err) {
        setState('error');
        setErrorMsg((err as Error).message);
      }
    };
    validate();
  }, [token]);

  const confirmUnsubscribe = async () => {
    if (!token) return;
    setState('submitting');
    try {
      const { data, error } = await supabase.functions.invoke(
        'handle-email-unsubscribe',
        { body: { token } }
      );
      if (error) throw error;
      if (data?.success || data?.reason === 'already_unsubscribed') {
        setState(data?.reason === 'already_unsubscribed' ? 'already' : 'success');
      } else {
        setState('error');
        setErrorMsg('Could not process unsubscribe. Please try again.');
      }
    } catch (err) {
      setState('error');
      setErrorMsg((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-catalyst-copper/10 flex items-center justify-center">
            <MailX className="h-6 w-6 text-catalyst-copper" />
          </div>
          <CardTitle>Unsubscribe from Catalyst Mom emails</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {state === 'validating' && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Checking your link…</p>
            </div>
          )}

          {state === 'ready' && (
            <>
              <p className="text-muted-foreground">
                Click below to stop receiving non-essential emails from us.
                You'll still get account-related emails (like password resets).
              </p>
              <Button onClick={confirmUnsubscribe} className="w-full">
                Confirm unsubscribe
              </Button>
            </>
          )}

          {state === 'submitting' && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Processing…</p>
            </div>
          )}

          {state === 'success' && (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <p className="text-foreground font-medium">You've been unsubscribed.</p>
              <p className="text-sm text-muted-foreground">
                We're sorry to see you go.
              </p>
            </div>
          )}

          {state === 'already' && (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <p className="text-foreground font-medium">You're already unsubscribed.</p>
            </div>
          )}

          {(state === 'invalid' || state === 'error') && (
            <div className="flex flex-col items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <p className="text-foreground font-medium">
                {state === 'invalid' ? 'Invalid or expired link' : 'Something went wrong'}
              </p>
              {errorMsg && (
                <p className="text-sm text-muted-foreground">{errorMsg}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
