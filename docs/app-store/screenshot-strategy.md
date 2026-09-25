# Catalyst Mom App Store screenshot strategy

Date: 2026-09-17
Target: Apple App Store, iPhone 6.9-inch portrait (1320 x 2868)
Tooling: Goldie + Argent + iOS Simulator

## Positioning decision

The screenshot sequence should sell a progression, not a collection of features:

1. Understand what this mother needs now.
2. Give her a clear next step today.
3. Help her build strength progressively.
4. Reduce the mental load around meals and wellness.
5. Keep guidance and community together as her stage changes.

Competitors commonly lead with pregnancy/postpartum workouts, short sessions, or expert guidance. Catalyst Mom's differentiated story is the connected journey across TTC, pregnancy, postpartum, and motherhood: assessment, plan, movement, nourishment, progress, and support in one account.

## Recommended screenshot strip

### 1. Assessment result / personalized plan

- Headline: **Stop guessing. Start with you.**
- Subhead: Your assessment turns your stage, goals, and concerns into a clearer next step.
- Screen: Assessment results or the strongest personalized-plan state.
- Purpose: Lead with the emotional problem—uncertainty—before showing features.

### 2. Stage-specific dashboard

- Headline: **Know what to do today.**
- Subhead: See your workouts, wellness guidance, and progress in one calm place.
- Screen: Populated dashboard with a clear current recommendation.
- Purpose: Demonstrate that the assessment produces an actionable experience.

### 3. Progressive workouts

- Headline: **Build strength, progressively.**
- Subhead: Follow short, stage-aware sessions without piecing together random workouts.
- Screen: A strong workout-plan or workout-detail screen with realistic duration and stage labels.
- Purpose: Convert the largest existing content interest—pregnancy and postpartum movement.

### 4. Meal planning

- Headline: **Less meal-planning mental load.**
- Subhead: Keep practical recipes and stage-aware nourishment ideas close at hand.
- Screen: Populated meal plan or recipe detail with attractive, real food imagery.
- Purpose: Expand the value beyond exercise without implying clinical nutrition treatment.

### 5. Guidance and community

- Headline: **Support that grows with you.**
- Subhead: Keep guidance, progress, and mom-to-mom community connected through every stage.
- Screen: Community or coach screen with realistic, consented content and no private personal information.
- Purpose: Finish with belonging and continuity—the reason to keep the app after one program ends.

## Visual direction

- Warm cream-to-soft-blush backgrounds aligned with the Catalyst Mom brand.
- Dark warm-brown headline text with strong contrast.
- DM Sans for clean mobile readability.
- Silver iPhone bezel so the app—not the hardware—carries the color.
- Use an editorial rhythm: hero opener, offset dashboard, restrained tilt for workouts, clean meal-plan tile, minimal community closer.
- Keep copy to one short headline and, when necessary, one short supporting sentence.
- Never add fake ratings, awards, testimonials, medical outcomes, or guarantees.
- Every visible profile, comment, progress value, and assessment result must be approved demo data.

## Capture requirements

- Use a Release iOS Simulator build of `com.catalystmomofficial.app`.
- Capture a populated demo account with no real member data.
- Pin the status bar and use a consistent light appearance.
- Remove debug banners, placeholder cards, broken images, admin navigation, and empty states.
- Verify every final PNG has no alpha channel and exactly matches an Apple-accepted 6.9-inch size.

## Information-gain check

Generic claims intentionally avoided: “all-in-one,” “transform your life,” “best app for moms,” and unsupported “safe for everyone” language.

Specific Catalyst Mom value used instead: an assessment-led journey spanning TTC through postpartum and motherhood, with stage-aware movement, nourishment, progress, guidance, and community connected inside one account.

Before final copy is locked, the founder should supply only facts that can be documented:

1. What exact information from the assessment changes what a member sees next?
2. What is the typical duration range of Catalyst Mom workouts?
3. Which parts of the experience are available in TTC, pregnancy, postpartum, and general motherhood?
4. Which professional credentials or review process can be stated publicly and verified?
5. Which real, consented demo content may appear in the community screenshot?

## Current environment status

Goldie 0.3.1 and its official Codex skill are installed. Xcode 27, the iOS 27 Simulator runtime, Node 22, and FFmpeg are available. The native accessibility capture driver was unstable in this environment, so the approved screenshot set was captured from the same production web bundle at Apple's exact 6.9-inch pixel dimensions, then framed and validated through Goldie.
