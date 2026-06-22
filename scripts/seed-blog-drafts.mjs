#!/usr/bin/env node
/**
 * Seed SEO draft blog posts into the Catalyst Mom `blogs` table.
 *
 * Usage:
 *   --sql                       Print INSERT statements for the Supabase SQL Editor
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-blog-drafts.mjs
 *                               Insert directly via the Supabase REST API
 *
 * All posts are inserted with status='draft' so they can be reviewed and
 * published from /admin. Re-running skips posts whose slug already exists.
 */

const SUPABASE_URL = 'https://moxxceccaftkeuaowctw.supabase.co';

const img = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const DISCLAIMER = `<p><em>This article is for educational purposes only and is not medical advice. Always consult your healthcare provider before starting or changing any exercise, nutrition, or fertility plan.</em></p>`;

export const DRAFTS = [
  {
    title: 'How to Use a Birth Ball to Help Induce Labor',
    slug: 'birth-ball-to-induce-labor',
    tags: ['pregnancy', 'birth ball', 'labor'],
    featured_image_url: img('photo-1530530824905-661c730c77e0'),
    excerpt: 'Can bouncing on a birth ball really kickstart labor? What the research says, the movements midwives recommend, and how to do them safely at home.',
    content: `
<h2>Can a Birth Ball Really Induce Labor?</h2>
<p>Short answer: a birth ball will not flip a switch and start labor on its own — no tool can. But research and midwife experience agree that birth ball movements can help create the <strong>conditions</strong> labor needs: an open pelvis, a well-positioned baby, and gentle, consistent pressure on the cervix.</p>
<p>A randomized study of first-time mothers found that women who used birth ball exercises had a meaningfully shorter average labor (about 14.4 hours vs 19.2 hours in the control group) and reported less pain. So while "induce" is too strong a word, "prepare and encourage" is exactly right.</p>

<h2>How It Works</h2>
<ul>
<li><strong>Opens the pelvis.</strong> Sitting upright on the ball with knees below hips widens the pelvic outlet, giving baby room to descend.</li>
<li><strong>Encourages optimal positioning.</strong> Gentle rocking and circles help baby rotate into the head-down, back-facing-front position that makes labor smoother.</li>
<li><strong>Applies cervical pressure.</strong> As baby drops lower, the head presses on the cervix — the natural signal that stimulates contractions.</li>
<li><strong>Relaxes you.</strong> Tension slows labor. Rhythmic movement releases it.</li>
</ul>

<h2>The 4 Movements to Try (From 37+ Weeks, With Your Provider's OK)</h2>
<h3>1. Gentle Bouncing</h3>
<p>Sit tall, feet flat and shoulder-width apart, and bounce softly for 5–10 minutes. Think rhythm, not height.</p>
<h3>2. Hip Circles</h3>
<p>Circle your hips slowly in one direction for a minute, then reverse. This is the classic midwife-recommended move for helping baby settle into the pelvis.</p>
<h3>3. Figure 8s</h3>
<p>Trace a figure 8 with your hips. It combines the benefits of circles in both directions and feels wonderful on a tight lower back.</p>
<h3>4. Supported Lean (Kneeling)</h3>
<p>Kneel on a cushion and drape your chest over the ball, rocking gently. Great for back labor prep, and a perfect position for your partner to massage your lower back.</p>

<h2>Safety First</h2>
<ul>
<li>Wait until at least 37 weeks before doing labor-encouraging movements, and clear it with your midwife or OB first.</li>
<li>Make sure your ball is the right size — hips level with or slightly above knees. See our <a href="/birth-ball-guide/buying-guide">birth ball buying guide</a> for sizing by height.</li>
<li>Place the ball on carpet or a yoga mat, never a slick floor.</li>
<li>Stop if you feel pain, dizziness, or notice reduced baby movement.</li>
</ul>

<h2>Keep Going</h2>
<p>Want guided routines with pictures and timers? Our free <a href="/birth-ball-guide">Birth Ball Guide</a> includes trimester-by-trimester exercises, an <a href="/birth-ball-guide/early-labor">early labor section</a>, and a <a href="/birth-ball-guide/breathing-practice">breathing practice</a> to pair with every movement.</p>
<h2>The Honest Part Most Blogs Skip</h2>
<p>No movement — ball, walking, curb-walking, pineapple, any of it — starts labor before your body and baby are ready. What birth ball work actually does is remove the mechanical obstacles (tight pelvis, awkward baby position) so that when labor is ready to start, nothing is in its way. That reframe matters: if you bounce for three days and nothing happens, the ball did not fail. Your body is still finishing its prep.</p>

<h2>A Realistic Day-by-Day Rhythm (38+ Weeks)</h2>
<table>
<thead><tr><th>Time</th><th>Movement</th><th>How long</th></tr></thead>
<tbody>
<tr><td>Morning</td><td>Gentle bouncing while having breakfast or watching TV</td><td>10 min</td></tr>
<tr><td>Midday</td><td>Hip circles, both directions</td><td>5 min</td></tr>
<tr><td>Afternoon</td><td>Replace your desk or sofa chair with the ball</td><td>20–30 min of just sitting</td></tr>
<tr><td>Evening</td><td>Figure 8s, then the kneeling lean while your partner massages your back</td><td>10 min</td></tr>
</tbody>
</table>
<p>Consistency over days beats one heroic two-hour session. Sitting on the ball instead of slouching into a couch may be the single most useful habit on this list — couch-slouching encourages baby into a back-to-your-back position, which is associated with longer, harder back labor.</p>

<h2>Signs It Is Helping — and Signs to Stop</h2>
<ul>
<li><strong>Encouraging:</strong> more pelvic pressure, lightning-crawl sensations, loss of mucus plug, baby feeling lower, irregular practice contractions becoming more noticeable.</li>
<li><strong>Stop and call your provider:</strong> bleeding, fluid leaking, painful regular contractions before 37 weeks, dizziness, or a noticeable drop in baby movement.</li>
</ul>

<h2>Birth Ball &amp; Labor FAQ</h2>
<h3>How long should I bounce on a birth ball to encourage labor?</h3>
<p>Short, frequent sessions — 10–15 minutes a few times a day — outperform marathon sessions and will not exhaust you before the actual event. There is no evidence that more hours equals faster labor.</p>
<h3>Can bouncing on a birth ball break your water?</h3>
<p>Gentle bouncing will not rupture healthy membranes. If your water does release while on the ball, it was ready to go regardless — note the time, color, and amount, and call your provider.</p>
<h3>Does it work at 38 or 39 weeks?</h3>
<p>You can absolutely do all of these movements then — they improve comfort and positioning at any late-pregnancy week. Just hold the expectation loosely: the closer your body already is to labor, the more these movements appear to "work."</p>
${DISCLAIMER}`,
  },
  {
    title: 'Peanut Ball vs Birth Ball: Which One Do You Actually Need?',
    slug: 'peanut-ball-vs-birth-ball',
    tags: ['pregnancy', 'birth ball', 'labor'],
    featured_image_url: img('photo-1544367567-0f2fcb009e0b'),
    excerpt: 'They both live in delivery rooms, but a peanut ball and a birth ball do very different jobs. Here is how to choose — or why you might want both.',
    content: `
<h2>The Quick Answer</h2>
<p>A <strong>birth ball</strong> (round) is for <em>active, upright movement</em> — sitting, bouncing, rocking, and hip circles during pregnancy and early labor. A <strong>peanut ball</strong> (peanut-shaped) is for <em>resting positions</em> — it goes between your knees while you lie on your side, keeping the pelvis open when you cannot be upright, such as with an epidural.</p>

<h2>Side-by-Side Comparison</h2>
<table>
<thead><tr><th></th><th>Birth Ball</th><th>Peanut Ball</th></tr></thead>
<tbody>
<tr><td><strong>Shape</strong></td><td>Round</td><td>Peanut / hourglass</td></tr>
<tr><td><strong>Best for</strong></td><td>Pregnancy comfort, active labor, postpartum exercise</td><td>Labor with an epidural, side-lying rest</td></tr>
<tr><td><strong>How you use it</strong></td><td>Sit and move on it</td><td>Place between knees while lying down</td></tr>
<tr><td><strong>Evidence</strong></td><td>Shorter labor, less pain in studies</td><td>Studies show faster dilation and fewer cesareans when used with epidurals</td></tr>
<tr><td><strong>Use after birth?</strong></td><td>Yes — core rehab, soothing baby</td><td>Rarely</td></tr>
</tbody>
</table>

<h2>When the Birth Ball Wins</h2>
<p>If you are buying one tool for pregnancy through postpartum, get the round ball. You can use it from the first trimester for posture and back pain, through labor for movement, and afterward for gentle core work and even bouncing a fussy newborn. Start with our <a href="/birth-ball-guide">complete birth ball guide</a> and make sure you get the right size in the <a href="/birth-ball-guide/buying-guide">buying guide</a>.</p>

<h2>When the Peanut Ball Wins</h2>
<p>If you are planning an epidural or know you will labor mostly in bed, ask whether your hospital provides peanut balls (many do). Tucked between your knees in a side-lying position, it keeps the pelvic outlet open so baby can keep descending even while you rest.</p>

<h2>The Real Answer for Most Moms</h2>
<p>Own a birth ball; borrow the hospital's peanut ball. You get daily value from the round ball for months, while the peanut ball shines for a matter of hours — and the hospital usually has one waiting.</p>

<h2>Sizing Cheat Sheet</h2>
<ul>
<li>Under 5'3": 55 cm ball</li>
<li>5'4"–5'9": 65 cm ball</li>
<li>5'10" and taller: 75 cm ball</li>
</ul>
<p>Check the fit: sitting on the ball, your hips should be level with or slightly higher than your knees. More sizing help and anti-burst safety tips in our <a href="/birth-ball-guide/safety">safety guide</a> and <a href="/birth-ball-guide/faq">FAQ</a>.</p>
<h2>The Positions Labor Nurses Actually Set Up</h2>
<p>If you do end up with a peanut ball, these are the two configurations used most on labor floors:</p>
<ul>
<li><strong>Side-lying:</strong> you lie on your side, the peanut ball goes between your knees with both legs resting over it. This keeps the pelvic outlet open during epidural rest, and nurses typically rotate you to the other side every 30–60 minutes.</li>
<li><strong>Flying cowgirl:</strong> lying on your side, your top leg drapes forward over the ball while the bottom leg stays straight. Often used to help a baby rotate out of a posterior position.</li>
</ul>
<p>Knowing the names means you can simply ask your nurse, "Can we try the peanut ball side-lying?" — most will be delighted you know what it is.</p>

<h2>Our Honest Buying Advice</h2>
<p>This is the part most gear roundups will not tell you, because they earn commission on both balls: <strong>most moms should not buy a peanut ball.</strong> It is a single-purpose tool for a window of hours, hospitals increasingly stock them, and used ones resell constantly because they get used once. Put the money toward a quality anti-burst round ball (under $30) that you will sit on daily for months — or toward a postnatal program you will actually use, like <a href="/workouts/core-restore-foundations">Core Restore Foundations</a>.</p>

<h2>Peanut Ball vs Birth Ball FAQ</h2>
<h3>Can I use a regular gym exercise ball as a birth ball?</h3>
<p>If it is anti-burst rated (it should say so explicitly) and sized so your hips sit level with or above your knees, yes — birth balls and quality exercise balls are the same product with different marketing. Avoid cheap, thin-walled balls.</p>
<h3>What size peanut ball do I need?</h3>
<p>Most women fit a 50 cm peanut ball; very tall women (5'10"+) may prefer 60 cm. When in doubt, the smaller size is usually the right call — oversized peanut balls strain the hips.</p>
<h3>Do I need either one for a planned C-section?</h3>
<p>For the birth itself, no. But the round ball still earns its place in pregnancy (back pain, posture) and in <a href="/blog/c-section-recovery-exercises-week-by-week">post-cesarean recovery</a> as a gentle core tool later on.</p>
${DISCLAIMER}`,
  },
  {
    title: 'Diastasis Recti Exercises: Rebuild Your Core After Baby',
    slug: 'diastasis-recti-exercises',
    tags: ['postpartum', 'fitness', 'core'],
    featured_image_url: img('photo-1571019613454-1cb2f99b2d8b'),
    excerpt: 'Ab separation does not heal with crunches. These evidence-backed deep-core exercises restore strength, rebuild tension, and help close the gap.',
    content: `
<h2>What Diastasis Recti Actually Is</h2>
<p>During pregnancy, the connective tissue between your "six-pack" muscles (the linea alba) stretches to make room for baby. For about 60% of moms, that separation — diastasis recti — persists after birth. The result: a soft belly that will not flatten, a doming ridge when you sit up, low-back pain, or a core that just feels disconnected.</p>
<p>Here is the reframe that changes everything: healing is less about <em>closing the gap</em> and more about <em>rebuilding tension</em> across it with your deepest abdominal layer, the transverse abdominis (TVA).</p>

<h2>First: Check Your Gap</h2>
<p>Before starting, do a 60-second self-check (full instructions in our <a href="/blog/how-to-check-diastasis-recti-at-home">at-home diastasis test guide</a>). Knowing your starting width and depth lets you track real progress.</p>

<h2>The 5 Foundational Exercises</h2>
<h3>1. Diaphragmatic Breathing with TVA Engagement</h3>
<p>Lie on your back, knees bent. Inhale into your ribs and belly. As you exhale, gently draw your belly button toward your spine — like hugging baby with your abs, not sucking in. Hold 5 seconds. 10 reps. This breath is the foundation of every other exercise.</p>
<h3>2. Heel Slides</h3>
<p>Same position. Exhale, engage your TVA, and slowly slide one heel along the floor until the leg is straight, then return. Alternate. 8–10 per side. The challenge: keep your core engaged so your back never arches.</p>
<h3>3. Glute Bridges</h3>
<p>Exhale, engage, and lift your hips into a bridge. Hold 3 seconds, lower with control. 10–12 reps. Strong glutes take pressure off the healing midline.</p>
<h3>4. Modified Side Plank</h3>
<p>From your side with knees bent, lift your hips, keeping shoulder over elbow. Hold 10–15 seconds per side. Side work strengthens obliques without straining the linea alba.</p>
<h3>5. Bird Dog</h3>
<p>On hands and knees, exhale and extend opposite arm and leg while keeping hips level. Slow and controlled, 6–8 per side.</p>

<h2>The Rules That Protect Your Healing</h2>
<ul>
<li><strong>No doming, ever.</strong> If your belly cones or ridges during a movement, the load is too much. Regress and rebuild.</li>
<li><strong>Exhale on effort.</strong> Holding your breath spikes intra-abdominal pressure right at the weakest point.</li>
<li><strong>Skip crunches, sit-ups, and front planks</strong> until tension is restored — see the full <a href="/blog/exercises-to-avoid-diastasis-recti">list of exercises to avoid</a>.</li>
<li><strong>Consistency beats intensity.</strong> 10 focused minutes daily outperforms one hard weekly session.</li>
</ul>

<h2>Want a Structured Plan?</h2>
<p>Our <a href="/workouts/core-restore-foundations">Core Restore Foundations program</a> walks you through this exact progression week by week, with video coaching and built-in checkpoints. If you are more than 8 weeks postpartum and seeing no change, a pelvic floor physical therapist is worth every penny.</p>

<h2>How Long Does Recovery Take?</h2>
<p>With consistent daily work, most moms see meaningful change in <strong>6–12 weeks</strong>: the gap narrows, the midline firms up, and everyday movements stop feeling unstable. Full return to high-impact exercise commonly takes 3–6 months. Two honest caveats: progress is rarely linear (hormones, sleep, and carrying a growing baby all tug at it), and a small, firm residual gap is completely compatible with a strong, pain-free core. Function beats centimeters.</p>

<h2>Your First 4 Weeks: A Sample Progression</h2>
<table>
<thead><tr><th>Week</th><th>Daily focus (about 10 minutes)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Breathing with TVA engagement only — 3 sets of 10, morning and evening. Learn the exhale-engage pattern until it is automatic.</td></tr>
<tr><td>2</td><td>Add heel slides (8 per side) and glute bridges (10). Keep checking: no doming.</td></tr>
<tr><td>3</td><td>Add modified side planks (3 x 10 seconds per side). Increase bridge holds to 5 seconds.</td></tr>
<tr><td>4</td><td>Add bird dogs (6 per side). Re-test your gap and compare width <em>and</em> tension to week 0.</td></tr>
</tbody>
</table>
<p>From week 5 onward, progress one variable at a time — longer holds, more reps, then more challenging positions. The <a href="/workouts/core-restore-foundations">Core Restore Foundations program</a> continues this progression through full strength training.</p>

<h2>Beyond Exercise: Habits That Speed Healing</h2>
<ul>
<li><strong>Posture resets.</strong> Stack ribs over pelvis when standing and feeding. A rib cage flared toward the ceiling keeps constant stretch on the midline.</li>
<li><strong>Smart lifting mechanics.</strong> Bring baby (and car seat) close to your body, exhale as you lift, and avoid twisting mid-lift.</li>
<li><strong>Manage constipation.</strong> Straining is a direct pressure spike on the healing midline — fiber, water, and a footstool under your feet genuinely matter here.</li>
<li><strong>Sleep and protein.</strong> Connective tissue rebuilds with collagen, and collagen needs protein and rest. Aim for protein at every meal.</li>
</ul>

<h2>Diastasis Recti FAQ</h2>
<h3>Can diastasis recti heal years after pregnancy?</h3>
<p>Yes. The same deep-core retraining works whether you are 6 weeks or 6 years postpartum. Older diastasis often takes a little longer because compensation habits are ingrained, but the tissue still responds to progressive loading.</p>
<h3>Will a waist trainer or binder fix it?</h3>
<p>No. Compression garments can give comfort and gentle support in early postpartum, but they do not strengthen anything — and aggressive waist trainers can push pressure downward onto the pelvic floor. Use a soft wrap as scaffolding while you do the exercises, not instead of them.</p>
<h3>Can I lift weights with diastasis recti?</h3>
<p>Yes, with two rules: exhale and engage before every rep, and choose loads where you can keep a flat midline (no doming). Many moms get stronger throughout recovery — the lifts just get selected and scaled deliberately.</p>
<h3>When should I see a pelvic floor physical therapist?</h3>
<p>If your gap is wider than four fingers, feels deep and soft with no improvement after 6–8 weeks of consistent work, or you have pain, bulging, or leaking, book the appointment. One assessment usually pays for itself in months of better-targeted work.</p>
${DISCLAIMER}`,
  },
  {
    title: 'How to Check for Diastasis Recti at Home (60-Second Test)',
    slug: 'how-to-check-diastasis-recti-at-home',
    tags: ['postpartum', 'core'],
    featured_image_url: img('photo-1518611012118-696072aa579a'),
    excerpt: 'A simple finger-width test you can do on your living room floor tells you whether you have ab separation, how wide it is, and what to do next.',
    content: `
<h2>The 60-Second Test</h2>
<ol>
<li><strong>Lie on your back</strong>, knees bent, feet flat on the floor.</li>
<li><strong>Place your fingers</strong> horizontally just above your belly button, fingertips pointing down toward your spine.</li>
<li><strong>Lift your head and shoulders</strong> slightly off the floor — just enough to feel your ab muscles tense on either side of your fingers.</li>
<li><strong>Feel the gap.</strong> How many finger-widths fit between the two muscle ridges? Note the width <em>and</em> the depth (does the tissue feel firm and springy, or soft and squishy?).</li>
<li><strong>Repeat</strong> 2 inches above the belly button and 2 inches below — separation can vary along the midline.</li>
</ol>

<h2>Reading Your Results</h2>
<table>
<thead><tr><th>Gap width</th><th>What it means</th></tr></thead>
<tbody>
<tr><td>1 finger or less</td><td>Normal — no diastasis</td></tr>
<tr><td>2 fingers</td><td>Mild separation — very common, responds well to exercise</td></tr>
<tr><td>2–3 fingers</td><td>Moderate diastasis — start a structured deep-core program</td></tr>
<tr><td>4+ fingers, or very soft/deep</td><td>See a pelvic floor physical therapist for an individual plan</td></tr>
</tbody>
</table>
<p><strong>Depth matters as much as width.</strong> A 2-finger gap with firm tension underneath is healthier than a 1-finger gap that feels like a soft trench. The goal of rehab is tension, not just narrowing.</p>

<h2>Other Signs Worth Noticing</h2>
<ul>
<li>A visible ridge or "doming" down your midline when you sit up out of bed</li>
<li>A belly that still looks pregnant months after birth despite weight loss</li>
<li>Low-back pain, hip pain, or a feeling of core weakness</li>
<li>Leaking urine when you sneeze or jump (often a companion pelvic floor issue)</li>
</ul>

<h2>When to Test</h2>
<p>Wait until at least 2–3 weeks postpartum — everything is naturally lax before then. Re-test every 2 weeks while doing core rehab so you can see progress in both width and tension.</p>

<h2>What to Do With Your Result</h2>
<p>If you found a gap, do not panic and do not start crunches. Begin with breath-led deep core work — our guide to <a href="/blog/diastasis-recti-exercises">safe diastasis recti exercises</a> covers the exact starting moves, and the <a href="/workouts/core-restore-foundations">Core Restore Foundations program</a> turns them into a progressive weekly plan.</p>
<h2>A Fact That Should Lower Your Stress</h2>
<p>By the third trimester, essentially <strong>100% of pregnant women have some degree of ab separation</strong> — it is how the body makes room, not an injury. Around 60% still measure a gap at six weeks postpartum, and roughly a third without targeted work still have one at a year. So a positive self-test does not mean something went wrong; it means you now have a baseline and a plan.</p>

<h2>Track It Properly: A Simple Log</h2>
<p>Re-test every two weeks, same time of day, and log four things. Tension is the number that predicts how your core <em>functions</em> — watch it as closely as width.</p>
<table>
<thead><tr><th>Date</th><th>Width above navel</th><th>Width at navel</th><th>Tissue feel (soft / springy / firm)</th></tr></thead>
<tbody>
<tr><td>Week 0</td><td>e.g., 3 fingers</td><td>e.g., 3.5 fingers</td><td>soft</td></tr>
<tr><td>Week 2</td><td>…</td><td>…</td><td>…</td></tr>
<tr><td>Week 4</td><td>…</td><td>…</td><td>…</td></tr>
</tbody>
</table>

<h2>What a Pelvic Floor PT Checks That You Cannot</h2>
<p>The finger test is a screening tool, not a full assessment. A pelvic floor physical therapist will also evaluate how your linea alba behaves under load, whether your pelvic floor co-contracts with your deep abs, your breathing mechanics, and any doming patterns during real movements. If your self-test shows 4+ fingers, a very soft trench, or no change after 6–8 weeks of consistent work, that one-hour assessment is the highest-value next step available.</p>

<h2>Diastasis Self-Test FAQ</h2>
<h3>Does everyone have a gap right after birth?</h3>
<p>Yes — immediately postpartum, separation is universal and expected. That is why testing before 2–3 weeks gives misleadingly scary numbers. Wait, then measure.</p>
<h3>Can diastasis recti get worse on its own?</h3>
<p>It can, if daily mechanics keep loading the midline — repeated crunch-style sit-ups out of bed, breath-holding while lifting, chronic constipation straining. The fix is the same habit set covered in our <a href="/blog/exercises-to-avoid-diastasis-recti">exercises-to-avoid guide</a>.</p>
<h3>Is a 1–2 finger gap something to fix?</h3>
<p>Up to about one finger with firm tension is considered functionally normal post-baby. Two fingers with good tension and no symptoms is usually fine too — train normally and re-check occasionally.</p>
${DISCLAIMER}`,
  },
  {
    title: '9 Exercises to Avoid With Diastasis Recti (+ Safe Swaps)',
    slug: 'exercises-to-avoid-diastasis-recti',
    tags: ['postpartum', 'fitness', 'core'],
    featured_image_url: img('photo-1571190264779-8fed513b7c91'),
    excerpt: 'Some popular ab exercises actively widen ab separation. Here are nine to skip while you heal — each with a safe swap that trains the same muscles.',
    content: `
<h2>Why Some Exercises Make the Gap Worse</h2>
<p>Diastasis recti heals when you build tension in the deep core <em>without</em> spiking pressure against the stretched midline. Any movement that bulges your belly outward, cones your midline, or loads your core before it can resist that load works against you. The test is simple: <strong>if you see doming, stop.</strong></p>

<h2>Skip These — Do These Instead</h2>
<table>
<thead><tr><th>Avoid for now</th><th>Why</th><th>Safe swap</th></tr></thead>
<tbody>
<tr><td>Crunches & sit-ups</td><td>Maximum pressure right on the gap</td><td>Heel slides</td></tr>
<tr><td>Full front planks</td><td>Gravity drags the belly down, doming the midline</td><td>Modified side plank</td></tr>
<tr><td>Double leg lifts</td><td>Long lever overwhelms a weak TVA</td><td>Single-leg heel taps</td></tr>
<tr><td>Russian twists</td><td>Loaded rotation shears the linea alba</td><td>Bird dog</td></tr>
<tr><td>Bicycle crunches</td><td>Flexion + rotation, the worst combo</td><td>Dead bug (single side)</td></tr>
<tr><td>Push-ups (full)</td><td>Same problem as front planks</td><td>Wall or incline push-ups</td></tr>
<tr><td>Heavy overhead lifting</td><td>Breath-holding spikes intra-abdominal pressure</td><td>Lighter weights, exhale on effort</td></tr>
<tr><td>Boat pose / v-sits</td><td>Sustained flexion under load</td><td>Glute bridges</td></tr>
<tr><td>High-impact running or jumping (early on)</td><td>Repetitive downward pressure on core and pelvic floor</td><td>Incline walking, building distance gradually</td></tr>
</tbody>
</table>

<h2>Three Habits That Matter as Much as Exercise</h2>
<ul>
<li><strong>Roll, don't crunch, out of bed.</strong> Roll to your side first, then push up with your arm. Every sit-up-style bed exit is an unplanned crunch.</li>
<li><strong>Exhale when you lift</strong> — baby, car seat, laundry. Pair effort with breath out and a gentle belly draw-in.</li>
<li><strong>Watch your posture.</strong> Rib-thrusting and constant belly-sucking both disrupt the pressure system your core needs to heal.</li>
</ul>

<h2>When Can I Go Back to Normal Workouts?</h2>
<p>When you can do the foundational moves with zero doming and your gap shows firm tension (re-test with our <a href="/blog/how-to-check-diastasis-recti-at-home">self-check guide</a>), begin re-introducing harder exercises one at a time. The <a href="/workouts/core-restore-foundations">Core Restore Foundations program</a> sequences this return for you, from first breath work to full strength training.</p>
<h2>The Gray Zone: It Depends on YOUR Core Today</h2>
<p>Here is the nuance most "avoid lists" miss: these are not banned exercises, they are <strong>not-yet exercises</strong>. The same front plank that domes your midline at 6 weeks postpartum may be perfectly safe at 16 weeks. The exercise is never the problem — the mismatch between load and your current capacity is. That is why the doming check beats any list, including this one.</p>

<h2>How to Re-Test an Exercise Back In</h2>
<ol>
<li><strong>Pick the easiest version.</strong> Wall push-up before incline, incline before floor.</li>
<li><strong>Do 3 slow reps while watching or feeling your midline.</strong> Hand on your belly works if you cannot see it.</li>
<li><strong>Pass:</strong> flat midline, no bulge, you could breathe normally → keep it, add 2 reps each session.</li>
<li><strong>Fail:</strong> any doming, pulling at the midline, or breath-holding → shelve it for two more weeks and stay with the regression.</li>
<li><strong>One new exercise per week, maximum.</strong> If something flares, you will know exactly which one.</li>
</ol>

<h2>Exercises People Worry About Unnecessarily</h2>
<ul>
<li><strong>Walking</strong> — safe from day one for most moms, and genuinely useful for recovery. Walk freely.</li>
<li><strong>Swimming</strong> — once postpartum bleeding has fully stopped and any incision is healed, the water's support makes it one of the friendliest full-body options.</li>
<li><strong>Carrying your baby</strong> — unavoidable and fine; just exhale on the lift and keep baby close to your body.</li>
<li><strong>Squats to a chair</strong> — these strengthen exactly the muscles that protect your midline. Encouraged, not avoided.</li>
</ul>

<h2>FAQ</h2>
<h3>Will I ever be able to do crunches again?</h3>
<p>Almost certainly yes. Once your midline holds tension under load, crunches are just another exercise to re-test in with the 5-step process above. Many moms are back to full ab training within 4–6 months of consistent rehab.</p>
<h3>How long do I need to avoid these exercises?</h3>
<p>It is capacity-based, not calendar-based — typically 8–16 weeks of progressive deep-core work before the most demanding moves pass the doming test. Track it with the <a href="/blog/how-to-check-diastasis-recti-at-home">self-test</a> every two weeks.</p>
${DISCLAIMER}`,
  },
  {
    title: 'C-Section Recovery Exercises: A Week-by-Week Guide',
    slug: 'c-section-recovery-exercises-week-by-week',
    tags: ['postpartum', 'fitness'],
    featured_image_url: img('photo-1544367567-0f2fcb009e0b'),
    excerpt: 'A cesarean is major surgery — your comeback should respect that. This week-by-week guide rebuilds your core safely from day one to month three.',
    content: `
<h2>The Golden Rule</h2>
<p>A cesarean cuts through skin, fascia, and the uterine wall. Healing takes a minimum of 6 weeks for the surface and months for deep tissue. The plan below is a typical progression — <strong>your OB clears each phase, not the calendar.</strong> Pain, pulling at the incision, or increased bleeding means step back.</p>

<h2>Weeks 1–2: Breathe, Walk, Heal</h2>
<ul>
<li><strong>Diaphragmatic breathing</strong>, several times a day. Inhale into the ribs; exhale with the gentlest lower-belly engagement. This reconnects your brain to your core and improves circulation for healing.</li>
<li><strong>Short, flat walks</strong> — start with 5 minutes, add a few minutes daily as comfort allows.</li>
<li><strong>Ankle pumps and gentle leg movement</strong> to support circulation.</li>
<li>Support your incision with a pillow when coughing, laughing, or sneezing.</li>
</ul>

<h2>Weeks 3–4: Wake Up the Deep Core</h2>
<ul>
<li><strong>Pelvic tilts</strong> lying on your back — flatten your low back into the floor on the exhale, 10 reps.</li>
<li><strong>Pelvic floor activations</strong> (gentle Kegels): squeeze, hold 3–5 seconds, fully relax. The pelvic floor and cesarean recovery are partners, not separate projects.</li>
<li><strong>Seated marches</strong> and longer walks, 15–20 minutes.</li>
</ul>

<h2>Weeks 5–6: Foundation Strength (With Clearance)</h2>
<ul>
<li><strong>Heel slides</strong> — 8–10 per side, core gently engaged.</li>
<li><strong>Glute bridges</strong> — 10–12 slow reps.</li>
<li><strong>Wall push-ups</strong> — upper body strength without core strain.</li>
<li>Check for diastasis recti with our <a href="/blog/how-to-check-diastasis-recti-at-home">60-second self-test</a>; cesarean moms get it too.</li>
</ul>

<h2>Weeks 7–12: Progressive Rebuild</h2>
<ul>
<li>Add <strong>bird dogs, modified side planks, squats to a chair, and resistance bands</strong>.</li>
<li>Walk briskly 30+ minutes; stationary cycling is a great low-impact add.</li>
<li>Hold off on running, jumping, and heavy lifting until roughly 12 weeks <em>and</em> you pass the basics without doming, pain, or leaking.</li>
</ul>

<h2>Red Flags — Call Your Provider</h2>
<ul>
<li>Incision redness, warmth, discharge, or opening</li>
<li>Pain that increases rather than fades</li>
<li>Bleeding that restarts or intensifies after activity</li>
<li>Fever, or a bulge near the scar</li>
</ul>

<h2>Make It a Plan, Not a Guess</h2>
<p>Our <a href="/workouts/core-restore-foundations">Core Restore Foundations program</a> is built for exactly this comeback, sequencing your weekly progression around real life with a newborn.</p>
<h2>What No One Tells You About C-Section Recovery</h2>
<ul>
<li><strong>Numbness around the scar is normal — for months.</strong> Nerves regrow slowly; many moms describe a numb or tingling band above the incision for 6–12 months. Sensation usually returns gradually.</li>
<li><strong>The "shelf" is not permanent for most moms.</strong> The overhang above the scar is a mix of healing tissue, fluid, and core weakness — all three improve with time, scar mobility work, and the deep-core training in this guide.</li>
<li><strong>Your first laugh, cough, and sneeze will be memorable.</strong> Keep a small pillow within reach for the first two weeks and brace it gently against the incision.</li>
<li><strong>Emotional recovery counts as recovery.</strong> An unplanned cesarean in particular can take processing. Talking it through — with your provider, a counselor, or moms who have been there in our <a href="/community">community</a> — is part of healing, not separate from it.</li>
</ul>

<h2>Scar Massage: The Most Skipped Step</h2>
<p>Once your provider confirms the incision is fully closed (commonly around 6–8 weeks), gentle scar mobilization helps prevent the scar tissue from adhering to layers beneath it — adhesions are a sneaky source of later core and hip discomfort.</p>
<ol>
<li>With clean hands, place two fingers just above the scar.</li>
<li>Move the skin gently in small circles, then side-to-side and up-and-down — you are moving the tissue, not rubbing the surface.</li>
<li>Work along the full scar for 3–5 minutes, once a day. Mild pulling is normal; sharp pain means stop and ask your provider or a pelvic floor PT.</li>
</ol>

<h2>C-Section Recovery FAQ</h2>
<h3>When can I lift my toddler again?</h3>
<p>The standard guidance is nothing heavier than your newborn for the first two weeks and gradual return after that as pain allows — but ask your own surgeon, especially if your delivery had complications. When you do lift, exhale, brace gently, and bring your toddler close before standing.</p>
<h3>When does the C-section pooch go away?</h3>
<p>Swelling settles over roughly 6–12 weeks; the deeper rebuild of core tension takes the months of progressive work outlined above. If the area still bulges noticeably at 6+ months despite consistent training, ask a provider to rule out diastasis recti or a hernia.</p>
<h3>Can I sleep on my stomach?</h3>
<p>As soon as it does not hurt — for most moms somewhere between 2 and 6 weeks. A pillow under your hips eases the transition.</p>
${DISCLAIMER}`,
  },
  {
    title: '7-Day Breastfeeding Meal Plan for New Moms',
    slug: 'breastfeeding-meal-plan-7-day',
    tags: ['nutrition', 'postpartum'],
    featured_image_url: img('photo-1512621776951-a57141f2eefd'),
    excerpt: 'Breastfeeding burns 300-500 extra calories a day. This realistic one-week meal plan keeps you nourished and your supply strong - no cooking marathons required.',
    content: `
<h2>What Your Body Needs Right Now</h2>
<p>Milk production is metabolically expensive: most nursing moms need an extra <strong>300–500 calories a day</strong> (roughly 2,200–2,400 total), plus elevated protein, calcium, iron, choline, iodine, and omega-3s. And hydration is non-negotiable — aim for about <strong>13 cups of fluids daily</strong>. A water bottle at every nursing station is the easiest habit win.</p>

<h2>The Plan at a Glance</h2>
<p>Every day follows the same simple skeleton, so there is nothing to memorize: <strong>3 meals + 2–3 snacks</strong>, each anchored by protein, fiber, and a healthy fat.</p>
<table>
<thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr></thead>
<tbody>
<tr><td>Mon</td><td>Overnight oats + chia, berries, almond butter</td><td>Chicken & quinoa grain bowl</td><td>Salmon, roasted sweet potato, broccoli</td></tr>
<tr><td>Tue</td><td>Greek yogurt, granola, banana</td><td>Lentil soup + whole grain toast</td><td>Slow-cooker chicken & veggie stew</td></tr>
<tr><td>Wed</td><td>Veggie omelet + avocado toast</td><td>Leftover stew (cook once, eat twice)</td><td>Turkey chili with beans</td></tr>
<tr><td>Thu</td><td>Oatmeal with flax, walnuts, apple</td><td>Tuna-white bean salad wrap</td><td>Stir-fry: beef or tofu, brown rice</td></tr>
<tr><td>Fri</td><td>Smoothie: spinach, banana, oats, peanut butter, milk</td><td>Leftover stir-fry</td><td>Sheet-pan chicken, potatoes, green beans</td></tr>
<tr><td>Sat</td><td>Whole grain pancakes + berries + yogurt</td><td>Hummus, veggie & feta pita</td><td>Baked white fish, couscous, salad</td></tr>
<tr><td>Sun</td><td>Scrambled eggs, spinach, toast</td><td>Big grain bowl with leftovers</td><td>Pasta with turkey meat sauce + side salad</td></tr>
</tbody>
</table>

<h2>Snack Bank (Grab Two Daily)</h2>
<ul>
<li>Trail mix or a handful of almonds + dried fruit</li>
<li>Lactation-friendly oat energy balls (oats, peanut butter, flax, honey)</li>
<li>Greek yogurt cup or string cheese + fruit</li>
<li>Hummus with cut veggies or whole grain crackers</li>
<li>Hard-boiled eggs (cook 6 on Sunday)</li>
</ul>

<h2>Why These Foods</h2>
<p>Oats, flax, lentils, and leafy greens appear all week on purpose — they are the foods most consistently linked with healthy supply. The full breakdown is in our guide to <a href="/blog/foods-to-increase-milk-supply">foods that support milk supply</a>.</p>

<h2>Survival-Mode Shortcuts</h2>
<ul>
<li><strong>Cook once, eat twice:</strong> every dinner above intentionally produces leftovers.</li>
<li><strong>One-dish wins:</strong> soups, sheet pans, and slow-cooker meals cut cleanup when you are one-handed with a baby.</li>
<li><strong>Accept the lasagna.</strong> When friends offer food, say yes.</li>
</ul>
<p>Adjust portions to your own appetite and any allergies — this is a flexible framework, not a rigid prescription. Swap like for like (any leafy green, any whole grain) and keep what your body and schedule can actually sustain.</p>
<h2>The 3am Snack Station (Build It Today)</h2>
<p>The meal plan above survives daylight hours. Night feeds are where nutrition quietly falls apart — you are ravenous at 3am and the only thing within reach is whatever requires zero hands and zero light. The fix is a small basket stocked weekly, placed wherever you feed:</p>
<ul>
<li>A large insulated water bottle with a straw (one-handed, no cap to drop)</li>
<li>Single-serve nut butter packets and a banana or apple</li>
<li>Oat energy balls or granola bars (lactation-friendly oats, no crumb explosion)</li>
<li>A small container of trail mix you can eat by feel in the dark</li>
</ul>
<p>This one habit closes most of the 300–500 calorie gap on the hardest days, which protects both your energy and your supply.</p>

<h2>Your One-Trip Grocery List for This Plan</h2>
<p><strong>Proteins:</strong> eggs, Greek yogurt, chicken thighs, salmon, ground turkey, canned tuna, white beans, lentils. <strong>Grains:</strong> oats, quinoa, brown rice, whole grain bread and pasta, couscous. <strong>Produce:</strong> spinach, broccoli, sweet potatoes, bananas, berries, apples, avocados, salad greens. <strong>Fats &amp; extras:</strong> peanut/almond butter, walnuts, ground flaxseed, chia seeds, olive oil, hummus, string cheese. One trip (or one delivery order) covers all seven days.</p>

<h2>Breastfeeding Nutrition FAQ</h2>
<h3>Do I need to avoid any foods while breastfeeding?</h3>
<p>Far fewer than the internet suggests. Standard guidance: limit high-mercury fish (shark, swordfish, king mackerel), keep caffeine under ~300 mg/day (2–3 coffees), and time alcohol carefully or skip it. Spicy food, garlic, beans — fine for most babies. Only restrict a food if your pediatrician identifies a specific reaction.</p>
<h3>Can I lose weight while breastfeeding?</h3>
<p>Gently, yes — a gradual loss of about 0.5 kg (1 lb) per week is considered compatible with supply for most moms once feeding is established. Aggressive cuts below ~1,800 calories are where supply commonly suffers. Focus on food quality first; the plan above supports both goals.</p>
<h3>Does this plan work if I am pumping or combo feeding?</h3>
<p>Yes — milk production costs the same calories regardless of how the milk leaves. Exclusive pumpers should be extra deliberate about the snack station, since pump sessions are easy to under-fuel.</p>
${DISCLAIMER}`,
  },
  {
    title: '12 Foods That Support Milk Supply, Backed by Science',
    slug: 'foods-to-increase-milk-supply',
    tags: ['nutrition', 'postpartum'],
    featured_image_url: img('photo-1490645935967-10de6ba17061'),
    excerpt: 'From oats to flaxseed, here are the foods with real evidence (or at least real nutrition) behind their milk-boosting reputation - and how to eat more of them.',
    content: `
<h2>First, the Honest Truth</h2>
<p>No food outranks the two real drivers of supply: <strong>frequent, effective milk removal</strong> and <strong>enough calories and fluids overall</strong>. But within a well-fed day, certain foods earn their reputation — either through emerging evidence or because they deliver exactly the nutrients lactation drains. Here are the twelve worth keeping in rotation.</p>

<h2>The List</h2>
<h3>1. Oats</h3>
<p>The classic. Rich in iron, fiber, and beta-glucans, which may support prolactin — the hormone that drives production. Overnight oats are the perfect one-handed breakfast.</p>
<h3>2. Flaxseed</h3>
<p>Omega-3s plus phytoestrogens. Stir ground flax into oatmeal, yogurt, or smoothies.</p>
<h3>3. Lentils</h3>
<p>Iron + protein + fiber in one cheap pantry staple. Low iron is linked with fatigue and supply struggles.</p>
<h3>4. Leafy Greens</h3>
<p>Spinach and kale bring calcium, iron, and folate. Blend into smoothies if salads feel impossible right now.</p>
<h3>5. Salmon</h3>
<p>DHA for baby's brain via your milk, plus vitamin D and protein. Two servings a week of low-mercury fish is the standard guidance.</p>
<h3>6. Eggs</h3>
<p>One of the best sources of choline, a nutrient most nursing moms under-consume.</p>
<h3>7. Nuts and Nut Butters</h3>
<p>Calorie-dense healthy fats — exactly what a 500-calorie daily deficit calls for.</p>
<h3>8. Greek Yogurt</h3>
<p>Protein + calcium + probiotics. Lactation pulls calcium from your bones if you do not replace it.</p>
<h3>9. Sweet Potatoes</h3>
<p>Vitamin A (critical for baby's development) and steady-energy carbs.</p>
<h3>10. Fennel</h3>
<p>Traditional galactagogue with small supportive studies. Roast it, or sip fennel tea.</p>
<h3>11. Barley</h3>
<p>The richest common source of beta-glucan. Swap it for rice in soups.</p>
<h3>12. Water (Honorary Member)</h3>
<p>Milk is ~90% water. Aim for 13 cups of fluids a day; chronic mild dehydration is the most common invisible supply saboteur.</p>

<h2>Put It Together</h2>
<p>You will find these foods woven through our <a href="/blog/breastfeeding-meal-plan-7-day">7-day breastfeeding meal plan</a>.</p>

<h2>When Food Is Not Enough</h2>
<p>If supply is genuinely struggling — slow weight gain, fewer wet diapers — see a lactation consultant before relying on any food or supplement. Latch and feeding frequency fix more supply problems than every galactagogue combined.</p>
<h2>What Probably Will Not Help (Save Your Money)</h2>
<p>The honest list nobody selling supplements writes:</p>
<ul>
<li><strong>Commercial lactation cookies.</strong> The active ingredient is usually plain oats — the same oats from your pantry at ten times the price, wrapped in sugar. Make the oat energy balls instead.</li>
<li><strong>Fenugreek capsules.</strong> The most-sold galactagogue has genuinely mixed evidence — some studies show small gains, others show <em>decreased</em> supply in a subset of women, plus GI upset and a maple-syrup smell. If you try it, treat it as an experiment with a two-week deadline, not a default.</li>
<li><strong>Expensive "supply support" drinks.</strong> Hydration helps; a particular blue sports drink has no magic ingredient. Water plus electrolytes does the same job.</li>
<li><strong>Eating dairy to "make" dairy.</strong> Milk does not require milk — calcium matters for <em>your</em> bones, but cows make milk from grass. Any calcium source works.</li>
</ul>

<h2>A Day of Eating for Supply</h2>
<p>What the list looks like assembled: overnight oats with flax, walnuts, and berries (breakfast) → lentil-spinach soup with whole grain bread (lunch) → two oat energy balls and a yogurt (snacks) → salmon, sweet potato, and broccoli (dinner) → and roughly 13 cups of fluids spread across the day, one glass anchored to every feed. That single day covers eleven of the twelve foods above without a single exotic ingredient.</p>

<h2>Milk Supply FAQ</h2>
<h3>How fast will I see a difference from eating better?</h3>
<p>Supply responds to total intake within days — many moms notice the difference from simply closing a calorie/hydration gap within 2–3 days. No food changes supply overnight, and none can outwork infrequent milk removal.</p>
<h3>I think my supply dropped suddenly — is it food?</h3>
<p>Usually not. The common culprits are a returning period, a stretch of skipped or shortened feeds, a new hormonal contraceptive, stress and sleep collapse, or baby becoming more efficient (which looks like less time at breast but is not a supply drop). Check those before changing your diet.</p>
<h3>Do I need galactagogues at all if baby is gaining well?</h3>
<p>No. Wet diapers and weight gain are the real scoreboard. If those are on track, your supply is fine — eat for your own energy and recovery.</p>
${DISCLAIMER}`,
  },
  {
    title: '25 Five-Minute Self-Care Ideas for Moms Who Have No Time',
    slug: 'self-care-ideas-busy-moms',
    tags: ['wellness', 'postpartum'],
    featured_image_url: img('photo-1506126613408-eca07ce68773'),
    excerpt: 'Self-care that requires a babysitter is not a plan. These 25 micro-practices fit inside nap time, car line, and the 5 minutes before everyone wakes up.',
    content: `
<h2>The Mindset Shift</h2>
<p>Research on maternal burnout is clear: small, <em>repeated</em> acts of self-kindness reduce exhaustion and stress more reliably than rare grand gestures. You do not need a spa day. You need 5 minutes, several times a day, claimed on purpose.</p>

<h2>Reset Your Nervous System (1–5 minutes)</h2>
<ol>
<li>Three slow, deep breaths in the car before walking into the house.</li>
<li>Step outside and feel the air for one full minute. That is it. That counts.</li>
<li>Drink a glass of water slowly, doing nothing else.</li>
<li>A 4-7-8 breath cycle: inhale 4, hold 7, exhale 8 — repeat four times.</li>
<li>Put one hand on your heart, close your eyes, and name three things you did right today.</li>
</ol>

<h2>Move Your Body (Without "Working Out")</h2>
<ol start="6">
<li>Stretch your shoulders while the microwave runs.</li>
<li>Ten slow squats while coffee brews.</li>
<li>A barefoot walk on grass with the baby in your arms.</li>
<li>Dance to one song in the kitchen — bonus if the kids join.</li>
<li>Lie on the floor, legs up the wall, for five minutes.</li>
</ol>

<h2>Feed Your Mind</h2>
<ol start="11">
<li>Read five pages of an actual book.</li>
<li>Journal three sentences: how you feel, what you need, one tiny win.</li>
<li>Listen to a podcast on headphones during one chore.</li>
<li>Sit in silence. No phone. Ninety seconds.</li>
<li>Write tomorrow's one most-important thing on a sticky note — then stop planning.</li>
</ol>

<h2>Stay Connected</h2>
<ol start="16">
<li>Voice-message a friend instead of doom-scrolling.</li>
<li>Schedule one monthly coffee date and protect it like a pediatric appointment.</li>
<li>Say one honest sentence to your partner about how today actually went.</li>
<li>Join a conversation in the <a href="/community">Catalyst Mom community</a> — moms who get it, on your schedule.</li>
<li>Hug someone for a full ten seconds.</li>
</ol>

<h2>Small Luxuries</h2>
<ol start="21">
<li>The good lotion, applied slowly.</li>
<li>Tea in your favorite mug, hot, finished while still hot.</li>
<li>A two-minute face massage while moisturizing.</li>
<li>Fresh socks mid-afternoon (do not knock it until you try it).</li>
<li>Go to bed fifteen minutes earlier and call it what it is: self-care.</li>
</ol>

<h2>Make It Stick</h2>
<p>Anchor each practice to something you already do — feed the baby, then drink the water; start the dishwasher, then stretch. Explore more guided practices in our <a href="/wellness/self-care">self-care hub</a> and track how you feel in your <a href="/dashboard">wellness dashboard</a>.</p>
<h2>Why "Sleep When the Baby Sleeps" Keeps Failing You</h2>
<p>The most-given advice in motherhood fails for a structural reason: baby's nap is the only block of time when nobody is touching you, and your brain knows it. Spending every nap asleep means the laundry, the texts, and — crucially — <em>you</em> never get a turn, so you lie there wired instead. The fix is a split: the first nap of the day is yours (rest or genuine downtime, not chores), and later naps go to whatever reduces tomorrow's stress. Permission to be strategic beats pressure to be asleep.</p>

<h2>The Burnout Check-In: 5 Questions</h2>
<p>Run this monthly. Two or more "yes" answers means your self-care needs to be scheduled, not squeezed in:</p>
<ol>
<li>Do small requests (one more snack, one more story) regularly trigger outsized irritation?</li>
<li>Have you stopped doing the one hobby or habit that used to feel like you?</li>
<li>Do you fantasize more about being alone than about anything fun?</li>
<li>Are you getting sick more often, or carrying constant low-grade exhaustion that sleep does not fix?</li>
<li>When someone asks how you are, is the honest answer "I do not actually know"?</li>
</ol>
<p>If most answers are yes and the feeling includes hopelessness or persistent sadness, that is beyond burnout — talk to your doctor; postpartum depression and anxiety are common and treatable at any point, not just the first weeks.</p>

<h2>Getting Your Partner On Board (Scripts That Work)</h2>
<ul>
<li>Swap vague for specific: not "I need more help," but <strong>"I need Saturday 8–9am. You have the kids. I will not be reachable."</strong></li>
<li>Trade explicitly: each partner gets one protected hour per weekend, named in advance, defended like a work meeting.</li>
<li>Put recurring self-care on the shared calendar. If it is not scheduled, it gets negotiated away — every time.</li>
</ul>

<h2>Self-Care FAQ</h2>
<h3>Is self-care selfish when my kids need me?</h3>
<p>The evidence says the opposite: maternal burnout degrades patience, mood, and even safety behaviors. The five-minute practices in this list are maintenance on the person your whole family runs on. It is infrastructure, not indulgence.</p>
<h3>What if I genuinely have no five minutes?</h3>
<p>Then borrow them from an existing block: the shower becomes two minutes longer, one feed happens with headphones and your playlist, three deep breaths happen at every red light. Attach care to what already exists rather than finding new time — and ask in the <a href="/community">community</a> what other moms in your exact season do; their answers are often the most realistic ones.</p>
${DISCLAIMER}`,
  },
  {
    title: 'How to Track Ovulation When TTC: 5 Methods Ranked',
    slug: 'how-to-track-ovulation-ttc',
    tags: ['ttc', 'wellness'],
    featured_image_url: img('photo-1506629905589-5d5b48f62a6a'),
    excerpt: 'Your fertile window is about six days a month. Finding it is the highest-impact thing you can do while TTC. Every tracking method, ranked.',
    content: `
<h2>Why Tracking Changes Everything</h2>
<p>Pregnancy is only possible during the <strong>fertile window</strong>: the five days before ovulation, the day of ovulation, and roughly a day after. Sperm survive up to five days; the egg lasts about 24 hours. Your best odds come from intercourse in the 1–2 days <em>before</em> ovulation — which means predicting it, not just spotting it after the fact.</p>

<h2>Method 1: Calendar Tracking (Free, Start Here)</h2>
<p>Mark day one of each period and count cycle lengths for several months. Ovulation typically happens 12–14 days <em>before</em> your next period starts — not on "day 14" unless you happen to have a textbook 28-day cycle. Best as a rough map; do not rely on it alone if your cycles vary.</p>

<h2>Method 2: Cervical Mucus (Free, Surprisingly Accurate)</h2>
<p>As ovulation approaches, discharge turns clear, slippery, and stretchy — like raw egg white. That is peak fertility, happening in real time. It costs nothing and tells you exactly when to prioritize trying.</p>

<h2>Method 3: Basal Body Temperature (Cheap, Confirms After the Fact)</h2>
<p>Take your temperature at the same time every morning before getting up. After ovulation, progesterone raises BBT by about 0.5–1.0°F, and it stays elevated. BBT cannot predict ovulation — it confirms it happened, which over 2–3 months reveals your personal pattern. Note: interrupted sleep (hello, newborns and night shifts) makes BBT noisy.</p>

<h2>Method 4: Ovulation Predictor Kits (Most Bang for the Buck)</h2>
<p>OPK strips detect the LH surge that occurs 24–36 hours before ovulation. Testing daily for five days around your expected ovulation catches it about 80% of the time; ten days of testing pushes that to ~95%. Strips are cheap in bulk — start testing a few days before your earliest predicted ovulation day.</p>

<h2>Method 5: Apps and Wearables (Best for Irregular Cycles)</h2>
<p>Cycle apps combine your logged data with algorithms; wearables add overnight temperature and heart-rate trends. They shine when cycles are irregular and manual prediction keeps missing. Treat their predictions as hypotheses to confirm with mucus or OPKs, not gospel.</p>

<h2>The Power Combo</h2>
<p>Most fertility specialists suggest pairing <strong>cervical mucus + OPKs</strong> for prediction, with <strong>BBT</strong> as monthly confirmation. Track all three in your <a href="/dashboard">Catalyst Mom dashboard</a>, where our TTC pattern reports help you see your cycle trends over time.</p>

<h2>When to Loop In a Professional</h2>
<p>Under 35: after a year of well-timed trying. 35 or older: after six months. Sooner if your cycles are very irregular or absent — that is data worth investigating, not just working around. And while you are trying, our guide to <a href="/blog/how-to-get-pregnant-faster-ttc-tips">evidence-based TTC tips</a> covers the lifestyle side.</p>

<h2>A Sample One-Cycle Tracking Routine</h2>
<table>
<thead><tr><th>Cycle phase</th><th>What to do</th></tr></thead>
<tbody>
<tr><td>Day 1 (period starts)</td><td>Log it. This anchors every other calculation.</td></tr>
<tr><td>Days 1–7</td><td>Take BBT each morning before getting up. Nothing else needed yet.</td></tr>
<tr><td>About 5 days before expected ovulation</td><td>Start daily OPK strips (same time each afternoon) and begin checking cervical mucus.</td></tr>
<tr><td>Positive OPK or egg-white mucus</td><td>This is the green light — prioritize the next 2–3 days.</td></tr>
<tr><td>2–3 days after suspected ovulation</td><td>Look for the sustained BBT rise that confirms ovulation happened.</td></tr>
<tr><td>End of cycle</td><td>Review the month: did the OPK, mucus, and temperature shift agree? Each cycle sharpens next month's prediction.</td></tr>
</tbody>
</table>

<h2>5 Common Tracking Mistakes</h2>
<ol>
<li><strong>Assuming day 14.</strong> Ovulation timing varies enormously; track your body, not a textbook cycle.</li>
<li><strong>Testing OPKs with morning urine.</strong> The LH surge often starts mid-morning — early afternoon testing catches it more reliably.</li>
<li><strong>Taking BBT after getting up.</strong> Even a trip to the bathroom first can distort the reading. Thermometer on the nightstand, reading before your feet hit the floor.</li>
<li><strong>Stopping intercourse after the positive OPK.</strong> The surge means ovulation is coming in 24–36 hours — the next two days still count, a lot.</li>
<li><strong>Switching methods every month.</strong> Each method needs 2–3 cycles of your own data before its predictions get sharp. Pick a combo and stay with it.</li>
</ol>

<h2>Ovulation Tracking FAQ</h2>
<h3>Can I ovulate without ever getting a positive OPK?</h3>
<p>Yes. Some women have short LH surges that a once-a-day test misses. If your BBT shows a clear sustained rise but OPKs stay negative, trust the temperature pattern — or test twice daily around your expected surge.</p>
<h3>Can I get pregnant outside the fertile window?</h3>
<p>Conception requires an egg, so functionally no — but the window is wider than it feels because sperm survive up to five days. The practical takeaway: starting "too early" costs nothing; starting after ovulation usually misses the month.</p>
<h3>How do I track with irregular cycles?</h3>
<p>Lean on real-time signals (cervical mucus and OPKs) rather than calendar prediction, and give it more testing days. Persistently irregular or absent cycles deserve a medical conversation — they are the most common treatable cause of slow conception.</p>
${DISCLAIMER}`,
  },
  {
    title: 'How to Get Pregnant Faster: 8 Evidence-Based Tips',
    slug: 'how-to-get-pregnant-faster-ttc-tips',
    tags: ['ttc', 'wellness', 'nutrition'],
    featured_image_url: img('photo-1609220136736-443140cffec6'),
    excerpt: 'Skip the old wives tales. These are the conception strategies actually supported by research - timing, nutrition, lifestyle, and when to ask for help.',
    content: `
<h2>The 8 Things That Actually Move the Needle</h2>
<h3>1. Nail the Timing</h3>
<p>This is 80% of the game. Have sex every day or every other day during your fertile window — the five days before ovulation through the day after. Find that window with our <a href="/blog/how-to-track-ovulation-ttc">ovulation tracking guide</a>.</p>
<h3>2. Start Folic Acid Now</h3>
<p>Prenatal vitamins with at least 400 mcg of folic acid matter <em>before</em> conception — neural tube development happens in the first weeks, often before a positive test.</p>
<h3>3. See Your Provider for a Preconception Check</h3>
<p>Medication review, vaccination status, thyroid, and any conditions like PCOS or endometriosis — fifteen minutes that can save months.</p>
<h3>4. Quit Smoking — Both Partners</h3>
<p>Tobacco measurably reduces egg quality and sperm count, and it is one of the most fixable fertility factors there is.</p>
<h3>5. Skip Alcohol While Trying</h3>
<p>The guidance keeps tightening: best evidence says none while actively trying, for both conception odds and earliest development.</p>
<h3>6. Eat Like It Matters</h3>
<p>A Mediterranean-style pattern — vegetables, whole grains, fish, olive oil, legumes — is associated with better fertility in both partners.</p>
<h3>7. Land in a Healthy Weight Range</h3>
<p>Both underweight and overweight can disrupt ovulation. Even a 5–10% weight change can restore regular cycles for some women. Gentle, consistent movement helps — favor sustainable, regular activity over intensity.</p>
<h3>8. Manage Stress (Without Being Told to "Just Relax")</h3>
<p>Chronic stress can disrupt the hormonal cascade behind ovulation. Mindfulness, sleep, walks, and community support are legitimate fertility tools — find your people in the <a href="/community">Catalyst Mom community</a>.</p>

<h2>3 Myths You Can Stop Worrying About</h2>
<ul>
<li><strong>"Lying with your legs up after sex helps."</strong> No evidence. Sperm reach the cervix within minutes regardless of gymnastics.</li>
<li><strong>"You should save up sperm by waiting between attempts."</strong> Long abstinence can actually reduce sperm quality. Every 1–2 days during the window is ideal.</li>
<li><strong>"Day 14 is ovulation day for everyone."</strong> Ovulation is 12–14 days before your <em>next</em> period — which lands all over the calendar depending on cycle length.</li>
</ul>

<h2>When to Ask for Help</h2>
<p>Under 35: after 12 months of well-timed trying. 35+: after 6 months. Right away if you have very irregular cycles, known reproductive conditions, or a partner with known fertility issues. Asking early is not giving up — it is gathering information.</p>

<h2>The Other Half: Male Fertility Quick Wins</h2>
<p>Roughly 40–50% of conception delays involve a male factor, and sperm regenerate on a ~72-day cycle — meaning changes made today show up in about ten weeks. The highest-impact moves:</p>
<ul>
<li><strong>Cool things down.</strong> Skip hot tubs and saunas, and keep laptops off laps. Sperm production is temperature-sensitive.</li>
<li><strong>Same lifestyle rules.</strong> No smoking, minimal alcohol, Mediterranean-style eating, and regular (not extreme) exercise all measurably improve sperm parameters.</li>
<li><strong>Check medications.</strong> Testosterone supplements in particular can shut down sperm production — ask the prescriber before TTC.</li>
<li><strong>A semen analysis is cheap and fast.</strong> If months are passing, this simple test should happen early, not as a last resort.</li>
</ul>

<h2>Your First Three Months TTC: A Simple Plan</h2>
<table>
<thead><tr><th>Month</th><th>Focus</th></tr></thead>
<tbody>
<tr><td>1</td><td>Start prenatal vitamins (both partners can take fertility-supportive supplements), book preconception checkups, begin <a href="/blog/how-to-track-ovulation-ttc">tracking your cycle</a> to learn your pattern.</td></tr>
<tr><td>2</td><td>Dial in timing: OPKs plus cervical mucus, intercourse every 1–2 days through the fertile window. Clean up sleep, alcohol, and smoking for real.</td></tr>
<tr><td>3</td><td>Keep the routine, review what your tracking shows. Irregular data this far in is worth a doctor conversation now rather than at the 12-month mark.</td></tr>
</tbody>
</table>

<h2>TTC FAQ</h2>
<h3>How long does it take most couples to conceive?</h3>
<p>With well-timed trying, roughly 30% conceive in the first cycle, about 80% within six months, and 85–90% within a year. A few months of trying without success is statistically normal, not a red flag.</p>
<h3>Does coming off birth control delay pregnancy?</h3>
<p>For most methods, fertility returns within a cycle or two — many women conceive the first month after stopping the pill. The exception is the contraceptive injection, which can take several months to clear. There is no required "wash-out" period.</p>
<h3>Do ovulation apps really work?</h3>
<p>Apps are excellent record-keepers and decent predictors once they have several cycles of your data — but their forecasts are statistical guesses. Confirm with body signals (OPKs, cervical mucus) before trusting any app's fertile-window highlight, especially with irregular cycles.</p>
${DISCLAIMER}`,
  },
  {
    title: 'Natural Sleep Tips for Kids — No Supplements Needed',
    slug: 'natural-sleep-tips-for-kids',
    tags: ['wellness', 'sleep', 'parenting tips'],
    // TODO: set a real featured image in /admin before publishing (upload to the
    // blog-images bucket — a sleeping child / cozy bedroom photo, 1200x630, subject centered).
    featured_image_url: '',
    excerpt: 'A calmer room, a 3-step bedtime routine, and daytime habits that help kids fall asleep faster and stay asleep — no supplements required.',
    content: `
<h2>Bedtime Battles Are Not Just "a Phase"</h2>
<p>If bedtime in your house involves three trips back to the bedroom, a negotiation over one more book, and a kid who is somehow wide awake at 9pm — you are not doing anything wrong, and you do not need a gummy vitamin or a melatonin drop to fix it. Sleep researchers and pediatric sleep coaches keep landing on the same three levers: the room, the routine, and the day that came before it. Get those right and most "my kid won't sleep" problems get dramatically smaller on their own.</p>

<h2>Step 1: Build a Room That Says "Sleep Now"</h2>
<ul>
<li><strong>Temperature.</strong> Aim for 68–75°F (20–24°C). An overheated room is one of the most common, most overlooked sleep disruptors — breathable cotton pajamas and lightweight bedding help more than people expect.</li>
<li><strong>Lighting.</strong> Start dimming household lights 1–2 hours before bed. Blackout curtains block streetlights and early sun; if your child is afraid of the dark, a very dim amber or red nightlight won't suppress melatonin the way a white or blue one will.</li>
<li><strong>Noise.</strong> Keep the room under about 45 dB — roughly the volume of a quiet conversation. A white noise machine is a legitimate tool here, not a crutch: unfamiliar or inconsistent sounds are one of the most common reasons kids wake mid-night.</li>
<li><strong>The sleep-only rule.</strong> Keep the bedroom for sleeping and quiet reading only — no toys, no screens, no energetic play. The fewer competing associations the room has, the faster "bed" reads as "time to sleep" to your child's brain.</li>
</ul>

<h2>Step 2: A 3-Step Routine That Actually Works</h2>
<p>Consistent bedtime routines are consistently linked to kids falling asleep faster, sleeping longer, and waking less — and the routine matters more than any single ingredient inside it. Aim for 20–45 minutes, same order, same time, every night.</p>
<h3>1. Connection Time (10–15 min)</h3>
<p>Quiet one-on-one bonding to release oxytocin and signal safety: an "I love you because…" game and gentle back rubs for toddlers, "Rose, Thorn, Bud" for preschoolers (one good thing, one hard thing, one thing to look forward to), or a simple daily reflection — "what went well, what could improve" — for school-age kids.</p>
<h3>2. Calming Activities (15–20 min)</h3>
<p>Help your child's nervous system shift out of "day mode." Reading together (skip adventure or suspense at bedtime), a gentle lotion massage, quiet music or white noise, or a slow "lazy breathing" exercise — in slow, out even slower — all work toward the same goal: lower cortisol, more melatonin.</p>
<h3>3. Sleep Prep (5–10 min)</h3>
<p>The practical wind-down: teeth, bathroom, pajamas, dimming lights room by room, saying goodnight to toys one by one. Try the "put-down method" — placing your child in bed drowsy but still awake, rather than already asleep — which builds independence and reduces reliance on rocking or feeding to fall asleep. Close with the same short bedtime phrase every night ("Night night, I love you, time for sleep now") so your child's brain learns that phrase means the routine is over.</p>
<p><strong>Give it 1–2 weeks before judging it.</strong> Most resistance fades once a routine becomes predictable — the consistency is doing the work, not any single step in isolation.</p>

<h2>Step 3: The Day Sets Up the Night</h2>
<ul>
<li><strong>Get outside daily.</strong> Natural light, especially in the morning and afternoon, is one of the strongest regulators of a child's circadian rhythm. Aim for 30–60 minutes of outdoor play.</li>
<li><strong>Let them burn energy.</strong> Active play builds the "sleep pressure" that makes falling asleep easier — just wrap up high-energy play 60–90 minutes before bed so there's time to wind down.</li>
<li><strong>Keep wake times consistent</strong>, weekends included. This anchors the body clock more than people expect.</li>
<li><strong>Screen curfew.</strong> Screens off 30–60 minutes before bed (ideally 1–2 hours) — blue light suppresses the melatonin that tells the brain it's night.</li>
<li><strong>Mind the dinner plate.</strong> Protein, complex carbs, vegetables; skip sugary treats and caffeine sources (yes, including chocolate) in the evening.</li>
<li><strong>Protect the last hour.</strong> Screen-free, low-stimulation: coloring, puzzles, building blocks, quiet conversation.</li>
</ul>

<h2>When Your Child Has More Energy Than the Routine Allows</h2>
<p>For high-energy or ADHD kids, the same framework still works — it just needs more runway:</p>
<ul>
<li>Start the routine earlier; many of these kids need 90+ minutes to fully wind down.</li>
<li>Burn energy on purpose before the routine starts (jumping jacks, a two-minute dance party), finishing 60–90 minutes before bed.</li>
<li>Sensory tools help: weighted blankets, firm hugs, compression pajamas.</li>
<li>Visual timers make "5 more minutes" concrete for a time-blind brain.</li>
<li>Reduce decision fatigue: "red or blue pajamas?" instead of an open-ended "which pajamas?"</li>
</ul>

<h2>Night Wakings and Bedtime Worries</h2>
<p>For <strong>night wakings</strong>, use a short, boring "night-wake script" — the same calm words or actions every time, no new props, no long conversations, lights dim. Predictability (even unexciting predictability) is what gets a child back to sleep fastest.</p>
<p>For <strong>bedtime worries</strong>, younger kids (ages 3–5) often do well with a "worry box" — they draw or "write" the worry, drop it in, and you promise to revisit it tomorrow. School-age kids (5–9) tend to respond better to a body-scan exercise: noticing toes, legs, tummy, arms, and head relaxing one at a time without moving.</p>

<h2>Quick Reference: Sleep Needs by Age</h2>
<table>
<thead><tr><th>Age</th><th>Recommended Sleep (24 hrs)</th></tr></thead>
<tbody>
<tr><td>1–2 years</td><td>11–14 hours, including naps</td></tr>
<tr><td>3–5 years</td><td>10–13 hours</td></tr>
<tr><td>6–12 years</td><td>9–12 hours</td></tr>
</tbody>
</table>

<h2>The Bottom Line</h2>
<p>Better sleep for kids tends to come from the boring, repeatable stuff — a cool dark quiet room, the same wind-down in the same order, and a day with enough light, movement, and screen boundaries to make sleep pressure build naturally. None of it works overnight, and none of it requires a bottle. Give a new routine a real two weeks before deciding it isn't working — and on the nights it falls apart anyway, going back to the routine the next night is the whole strategy. Your child's body remembers the rhythm even when one night doesn't go to plan.</p>
<p><em>This article is for general education and is not medical advice. If sleep problems are severe, sudden, or accompanied by snoring, gasping, or daytime symptoms, talk to your child's pediatrician — there are treatable causes (like sleep apnea) that a routine alone won't fix.</em></p>`,
  },
];

// ---------------------------------------------------------------------------

const rows = DRAFTS.map((d) => ({
  title: d.title,
  slug: d.slug,
  excerpt: d.excerpt,
  content: d.content.trim(),
  tags: d.tags,
  featured_image_url: d.featured_image_url,
  author: 'Catalyst Mom Team',
  status: 'draft',
}));

const sqlEscape = (s) => s.replace(/'/g, "''");

function toSql() {
  const values = rows
    .map(
      (r) =>
        `(\n  '${sqlEscape(r.title)}',\n  '${r.slug}',\n  '${sqlEscape(r.excerpt)}',\n  '${sqlEscape(r.content)}',\n  ARRAY[${r.tags.map((t) => `'${sqlEscape(t)}'`).join(', ')}],\n  '${r.featured_image_url}',\n  '${r.author}',\n  'draft'\n)`
    )
    .join(',\n');
  return `-- Catalyst Mom: seed SEO blog drafts (status='draft', publish from /admin)
-- Generated by scripts/seed-blog-drafts.mjs --sql
-- Safe to re-run: existing slugs are skipped.
INSERT INTO public.blogs (title, slug, excerpt, content, tags, featured_image_url, author, status)
VALUES
${values}
ON CONFLICT (slug) DO NOTHING;
`;
}

async function insertViaApi() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    console.error('Set SUPABASE_SERVICE_ROLE_KEY, or run with --sql to print SQL for the Supabase SQL Editor.');
    process.exit(1);
  }
  for (const row of rows) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blogs?on_conflict=slug`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates,return=minimal',
      },
      body: JSON.stringify(row),
    });
    console.log(`${res.ok ? 'OK  ' : 'FAIL'} ${row.slug}${res.ok ? '' : ' — ' + (await res.text())}`);
  }
}

function toUpdateSql() {
  const updates = rows
    .map(
      (r) =>
        `UPDATE public.blogs SET\n  title = '${sqlEscape(r.title)}',\n  excerpt = '${sqlEscape(r.excerpt)}',\n  content = '${sqlEscape(r.content)}',\n  tags = ARRAY[${r.tags.map((t) => `'${sqlEscape(t)}'`).join(', ')}]\nWHERE slug = '${r.slug}' AND status = 'draft';`
    )
    .join('\n\n');
  return `-- Catalyst Mom: SEO polish for seeded blog drafts
-- Generated by scripts/seed-blog-drafts.mjs --update-sql
-- Only touches posts still in 'draft'; published posts and
-- featured images are never overwritten. Safe to re-run.
${updates}
`;
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  if (process.argv.includes('--sql')) {
    process.stdout.write(toSql());
  } else if (process.argv.includes('--update-sql')) {
    process.stdout.write(toUpdateSql());
  } else {
    insertViaApi();
  }
}
