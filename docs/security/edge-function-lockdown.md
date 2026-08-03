# Edge function lockdown — safe rollout order

Two DB-trigger-called edge functions had **no caller authentication**:
`send-welcome-email` and `send-blog-notification`. Anyone who knew the URL
could trigger welcome emails for arbitrary user ids, or blast every
subscriber with a notification email.

They could not be fixed the same way as `send-push-notifications`, because
**both triggers present the ANON key, not the service-role key.** A
service-role/admin check would have silently broken signup emails and blog
notifications. They use a shared-secret header instead.

## The fail-open design (why deploying is safe)

`checkSharedSecret()` returns `null` when the env secret is not configured.
Both functions treat `null` as "allow". So:

| State | Behaviour |
|---|---|
| Secret NOT set (today) | Function allows everything — identical to current behaviour, nothing breaks |
| Secret set, trigger sends matching header | Allowed |
| Secret set, header missing/wrong | **403** — the lockdown is live |

This means each step below is independently safe. There is no window where
emails stop working.

## Rollout order (do not reorder)

**1. Deploy the functions.** Nothing changes yet — the secrets are unset, so
both still fail open.

```
supabase functions deploy send-welcome-email
supabase functions deploy send-blog-notification
```

**2. Run the migration** `20260803_secure_email_triggers.sql` (in
`supabase/migrations/`). It updates both triggers to send an
`x-webhook-secret` header. Still nothing is enforced — the functions ignore
the header while the secrets are unset.

Before running it, replace the two placeholder values in that file with
secrets you generate. Any long random string works, e.g.:

```
openssl rand -hex 32
```

**3. Set the same two secrets in Supabase** (Dashboard → Edge Functions →
Secrets, or `supabase secrets set`):

```
WELCOME_EMAIL_SECRET=<the value you put in the migration>
BLOG_NOTIFICATION_SECRET=<the value you put in the migration>
```

The moment these are set, the functions start rejecting any caller that does
not present the matching header. The triggers do, so they keep working.

## Verifying it worked

- **Welcome email:** register a new test account and confirm the email
  arrives.
- **Blog notification:** flip a draft post to `published` and confirm
  subscribers are emailed.
- **The lockdown itself:** POST to either function URL without the
  `x-webhook-secret` header — you should get `403 Invalid or missing webhook
  secret`. Before this change, it would have sent the email.

## Rollback

Unset the two secrets in Supabase. Both functions return to fail-open
immediately, with no code change or redeploy needed.
