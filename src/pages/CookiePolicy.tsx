import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { openCookieSettings } from "@/lib/cookieConsent";

const CookiePolicy = () => (
  <PageLayout>
    <SEO title="Cookie Policy | Catalyst Mom" description="Learn how Catalyst Mom uses cookies and similar technologies and manage your choices." />
    <main className="mx-auto max-w-4xl space-y-8 py-10 text-foreground">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="font-serif text-4xl font-semibold">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground">Effective and last updated: September 15, 2026</p>
        <p className="leading-7">This policy explains how Catalyst Mom uses browser storage, cookies, pixels, and similar technologies on catalystmomofficial.com and its assessment experience.</p>
      </header>

      <section className="space-y-3"><h2 className="font-serif text-2xl font-semibold">Your choices</h2>
        <p className="leading-7">Essential technologies keep accounts, security, payments, and requested features working. Analytics and marketing technologies are optional and remain disabled until you allow them. Rejecting optional technologies does not prevent you from using the core service.</p>
        <button type="button" onClick={openCookieSettings} className="rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground">Manage cookie choices</button>
      </section>

      <section className="space-y-3"><h2 className="font-serif text-2xl font-semibold">Technologies we use</h2>
        <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm">
          <thead><tr className="border-b"><th className="p-3">Technology/provider</th><th className="p-3">Category</th><th className="p-3">Purpose</th><th className="p-3">Control</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-3">Catalyst Mom consent preference</td><td className="p-3">Essential</td><td className="p-3">Remembers the choices you made on this device.</td><td className="p-3">Required to remember your choice; remove it by clearing site data.</td></tr>
            <tr className="border-b"><td className="p-3">Account session storage</td><td className="p-3">Essential</td><td className="p-3">Keeps you signed in and protects access to your account.</td><td className="p-3">Signing out or clearing site data removes the local session.</td></tr>
            <tr className="border-b"><td className="p-3">Security and payment providers</td><td className="p-3">Essential</td><td className="p-3">Fraud prevention, CAPTCHA challenges, and secure checkout when requested.</td><td className="p-3">These are loaded only where needed for core functions.</td></tr>
            <tr className="border-b"><td className="p-3">PostHog and Microsoft Clarity</td><td className="p-3">Analytics</td><td className="p-3">Helps us understand usage, errors, and where the experience can improve.</td><td className="p-3">Disable Analytics in Cookie Settings.</td></tr>
            <tr className="border-b"><td className="p-3">Pinterest tag</td><td className="p-3">Marketing</td><td className="p-3">Measures visits and conversions connected with Pinterest campaigns.</td><td className="p-3">Disable Marketing in Cookie Settings.</td></tr>
            <tr><td className="p-3">Omnisend website tools</td><td className="p-3">Marketing</td><td className="p-3">Supports newsletter forms and measures marketing engagement.</td><td className="p-3">Disable Marketing in Cookie Settings; email subscriptions can also be ended using an unsubscribe link.</td></tr>
          </tbody>
        </table></div>
        <p className="text-sm text-muted-foreground">Third-party names and storage identifiers can change when their services are updated. Their technologies may persist for a session or for the period described in their own policies. We review this inventory when our tools change.</p>
      </section>

      <section className="space-y-3"><h2 className="font-serif text-2xl font-semibold">Browser and device controls</h2>
        <p className="leading-7">You can also clear or block cookies through your browser or device settings. Blocking essential storage may stop login, checkout, or security features from working. Catalyst Mom does not currently respond to browser “Do Not Track” signals because there is no uniform standard; use Cookie Settings to control optional tracking.</p>
      </section>

      <section className="space-y-3"><h2 className="font-serif text-2xl font-semibold">Contact</h2>
        <p>Questions about these technologies can be sent to <a className="text-primary underline" href="mailto:hello@catalystmomofficial.com">hello@catalystmomofficial.com</a>.</p>
      </section>
    </main>
  </PageLayout>
);

export default CookiePolicy;
