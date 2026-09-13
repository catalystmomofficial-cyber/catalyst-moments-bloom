# Catalyst Mom App Store Readiness Audit

Date: 2026-09-10

## Executive decision

Catalyst Mom is not ready to upload to App Store Connect yet. The current
repository is a React/Vite progressive web app. It has no native iOS target,
Xcode workspace, bundle identifier, provisioning configuration, StoreKit
implementation, or iOS privacy manifest.

The lowest-risk route is to preserve the existing React product and add a
Capacitor iOS shell with meaningful native functionality. Lance should be used
after that target builds successfully: for certificates, provisioning,
App Store Connect metadata, TestFlight, screenshots, review status, and the
submission workflow.

## Current readiness

| Area | Status | Evidence / required action |
|---|---|---|
| Native iOS target | Blocked | No `ios/`, Xcode project, Capacitor, Expo, or React Native configuration exists. |
| Minimum functionality | High risk | A plain website wrapper risks rejection under Guideline 4.2. Add native navigation, push handling, deep links, offline/error states, share support, and platform-quality interaction. |
| Digital subscriptions | Blocked | Membership checkout uses Stripe. The iOS app must use StoreKit/In-App Purchase for digital access, with restore purchases and entitlement syncing. |
| Digital credits/guides | Blocked | Credit packs and digital product checkout use Stripe/PayPal. Digital content consumed in the app must use IAP unless a specific exception applies. |
| Physical/real-world services | Review | A genuinely live, person-to-person event or service may use external payment, but recorded/digital access cannot be mixed into that exemption. Classify each event before exposing payment in iOS. |
| Social login | Blocked | Google sign-in is offered. Add Sign in with Apple with equivalent prominence and account-linking behavior. |
| Account deletion | Blocked | Privacy copy discusses deletion, but no in-app account-deletion flow was found. Add deletion inside account settings, including subscription guidance and server-side erasure workflow. |
| User-generated content | Blocked | Community posting exists, but user-facing report-content, block-user, moderation contact, filtering, and admin response tooling were not found as a complete system. |
| Health and medical safety | High risk | The app contains TTC, pregnancy, postpartum, contraction, kick-counting, nutrition, and AI guidance. Keep educational positioning, emergency escalation, limitations, source provenance, and provider referral visible at the point of use. |
| Privacy disclosures | Blocked | Create the App Store privacy answers from actual Supabase, Firebase, PostHog, Pinterest, payment, and AI data flows. Add `PrivacyInfo.xcprivacy` and required SDK manifests once the native target exists. |
| Tracking consent | Review | Determine whether any SDK/data use qualifies as cross-company tracking. If it does, gate it behind AppTrackingTransparency; do not show ATT for first-party analytics that does not meet Apple's tracking definition. |
| Notifications | Partial | Web push exists. Native APNs permission must be contextual, optional, accurately described, and functional when declined. |
| App metadata | Not started | App name, subtitle, category, age rating, privacy URL, support URL, review notes, screenshots, keywords, and description need an App Store package. |
| Review access | Not started | Provide a stable demo account and review instructions for gated features, purchases, community, and maternal-stage personalization. |

## Recommended implementation sequence

### Phase 1 — Native foundation

1. Add Capacitor to the existing Vite app and create the iOS target.
2. Establish the production bundle identifier and Apple team.
3. Add native-safe navigation, status-bar/safe-area behavior, keyboard handling,
   deep links, universal links, offline/error states, and native share support.
4. Build and test on current iPhone simulator sizes and a physical device.

### Phase 2 — Apple compliance blockers

1. Implement StoreKit 2 subscriptions and restore purchases.
2. Map App Store entitlements into the existing Supabase subscription model.
3. Replace/hide Stripe and PayPal digital-goods checkout in the iOS runtime.
4. Add Sign in with Apple and robust identity linking.
5. Add complete in-app account deletion.
6. Add UGC reporting, user blocking, filtering, moderation contact, and admin
   resolution workflow.

### Phase 3 — Health, privacy, and quality

1. Review every health feature for claims, urgency rules, contraindications,
   source dates, and non-diagnostic language.
2. Inventory all collected data and third-party SDK transfers.
3. Add permission purpose strings and the iOS privacy manifest.
4. Test logged-out, free, paid, expired, offline, denied-permission, and
   account-deletion states.
5. Remove placeholders, dead controls, broken media, console errors, and web-only
   UI artifacts.

### Phase 4 — Lance and App Store Connect

1. Connect the Catalyst Apple Developer/App Store Connect team in Lance.
2. Ask Lance to list teams and bundles and read the current submission status.
3. Create the app record only after the bundle identifier is final.
4. Configure certificates/provisioning and upload a TestFlight build.
5. Prepare the listing, screenshots, privacy answers, IAP products, review notes,
   and demo credentials.
6. Run internal TestFlight testing, fix findings, then explicitly authorize the
   final App Review submission.

## Lance connection

The Lance MCP endpoint is installed globally in Codex at:

`https://api.lance.app/mcp`

OAuth authorization completed for the Lance organization **Catalyst**. Lance
uses a revocable per-user credential. Its documentation says organization
operator credentials and `.p8` files remain on Lance's side of the MCP boundary.
The final App Store submission remains consent-gated.

## Primary references

- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect Help: https://developer.apple.com/help/app-store-connect/
- Lance MCP documentation: https://www.lance.app/docs
- Lance iOS agent stack: https://www.lance.app/guides/ios-agent-stack

