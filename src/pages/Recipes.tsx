import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Heart, Clock, BookOpen, Download, Printer, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import JourneySpecificMealPlans from '@/components/recipes/JourneySpecificMealPlans';
import { mealPlans } from '@/data/recipeData';
import { useContentFilter } from '@/hooks/useContentFilter';

// ─── 30-Day Challenge Data ────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const CHALLENGE_WEEKS = [
  {
    number: 1, label: 'Week 1', title: 'Reset & Rejuvenate', subtitle: 'Ease In & Mobility',
    days: [
      { day: 1,  title: 'Set Your Glow Goals',    tasks: ['Write down 3 personal glow-up goals.', 'Take a "before" photo to track progress.'],               tip: 'Post your goals somewhere visible to stay motivated!' },
      { day: 2,  title: 'Hydrate & Refresh',       tasks: ['Start your morning with warm lemon water.', 'Drink at least 8 glasses of water today.'],          tip: 'Tag @Catalyst_Mom when you hit your water goal!' },
      { day: 3,  title: 'Quick Energy Boost',      tasks: ['Move your body for 10 minutes (stretch, dance, or walk).'],                                        tip: 'Snap a quick post-workout selfie and share your energy boost!' },
      { day: 4,  title: 'Mindful Eating',          tasks: ['Eat slowly and enjoy every bite.', 'No distractions (no phone or TV while eating).'],             tip: 'Try a new healthy recipe and share your favorite!' },
      { day: 5,  title: 'Mini Declutter',          tasks: ['Organize one small space (drawer, shelf, or counter).', 'Light a candle or play relaxing music.'], tip: 'Decluttering your space = decluttering your mind!' },
      { day: 6,  title: 'Self-Care Saturday',      tasks: ['Do something for YOU (face mask, bubble bath, or a long shower).'],                                tip: "Drop a 💖 if you're making time for YOU today!" },
      { day: 7,  title: 'Digital Detox',           tasks: ['No phone for the first & last hour of your day.'],                                                 tip: "Protect your peace — let's make this a habit!" },
    ],
    workouts: [
      { label: 'Full-Body Stretch (10 min)',         items: ['Neck rolls, shoulder rolls', 'Cat-cow (x10)', "Child's pose (30 sec)", 'Hip circles', 'Standing side stretches'] },
      { label: 'Pelvic Floor + Core (15 min)',       items: ['Deep belly breathing (5 min)', 'Pelvic tilts (x10)', 'Glute bridge (x12)', 'Bird-dog (x10 each side)', 'Wall sit (30 sec)'] },
      { label: 'Gentle Yoga Flow (15 min)',          items: ['Seated twists', 'Forward fold', 'Downward dog to cobra', 'Seated hip opener', 'Breathwork'] },
      { label: 'Posture Reset + Mobility (15 min)', items: ['Wall angels', 'Chest openers', 'Arm circles', 'Calf raises', 'Seated hamstring stretch'] },
      { label: 'Walk + Light Lower Body (20 min)',   items: ['10 min walk', 'Bodyweight squats (x10)', 'Standing leg lifts (x10 each)', 'Step-ups or lunges'] },
      { label: 'Stretch & Foam Roll (10–15 min)',    items: ['Focus on hips, back, calves', 'Add gentle massage ball work if available'] },
      { label: 'Rest / Recovery Day',                items: ['Optional: Guided meditation', 'Breathwork'] },
    ],
    meals: [
      { breakfast: 'Oatmeal w/ berries + flax',                lunch: 'Chicken + quinoa + spinach',            snack: 'Apple + almond butter',      dinner: 'Chicken noodle soup + whole-grain crackers' },
      { breakfast: 'Smoothie (banana + oats + almond butter)', lunch: 'Tuna wrap + cucumber salad',            snack: 'Greek yogurt + granola',      dinner: 'Baked salmon + steamed broccoli + quinoa' },
      { breakfast: 'Scrambled eggs + toast',                   lunch: 'Chickpea + roasted veg bowl',           snack: 'Boiled egg + fruit',          dinner: 'Grilled chicken + roasted sweet potatoes + green beans' },
      { breakfast: 'Avocado toast + boiled egg',               lunch: 'Turkey + veggie stir-fry',              snack: 'Almonds',                     dinner: 'Vegetable soup + bread' },
      { breakfast: 'Overnight oats',                           lunch: 'Chicken Caesar salad (light dressing)', snack: 'Rice cakes + hummus',         dinner: 'Spaghetti w/ marinara + side salad' },
      { breakfast: 'Fruit bowl + nut butter toast',            lunch: 'Grilled shrimp + couscous',             snack: 'Carrot sticks + hummus',      dinner: 'Veggie stir-fry with tofu + brown rice' },
      { breakfast: 'Smoothie bowl',                            lunch: 'Egg salad sandwich',                    snack: 'Dark chocolate square + tea', dinner: 'Grilled shrimp skewers + steamed vegetables' },
    ],
    csec: [
      { day: 'MON', note: 'Keep movements gentle and slow — no rushing cat-cow.' },
      { day: 'TUE', note: 'Place a pillow under hips for bridges; reduce bird-dog to arm or leg only (not both).' },
      { day: 'WED', note: "Avoid cobra pose if it pulls the incision; use child's pose with pillow instead." },
      { day: 'THU', note: 'Wall angels and chest openers are great — keep core relaxed.' },
      { day: 'FRI', note: 'Skip lunges; sub with step-backs using wall support.' },
      { day: 'SAT', note: 'Avoid direct foam roller pressure on scar area.' },
      { day: 'SUN', note: 'Full rest or guided meditation only.' },
    ],
  },
  {
    number: 2, label: 'Week 2', title: 'Nourish & Strengthen', subtitle: 'Core + Lower Body',
    days: [
      { day: 8,  title: 'Protein Power',         tasks: ['Add a protein-packed meal (eggs, chicken, lentils, or Greek yogurt).'],          tip: 'Strong body, strong mind — fuel up!' },
      { day: 9,  title: '15-Minute Workout',     tasks: ['Try a quick HIIT or strength session.'],                                          tip: 'Feeling strong? Tag @Catalyst_Mom and share your fave move!' },
      { day: 10, title: 'Green Boost',           tasks: ['Add leafy greens to two meals today.'],                                           tip: "Drop a 🥗 if you're fueling up with greens!" },
      { day: 11, title: 'Gratitude Check-In',   tasks: ['Write down 3 things you\'re grateful for.'],                                      tip: "A grateful heart is a glowing heart — what's yours today?" },
      { day: 12, title: 'Sleep Upgrade',         tasks: ['Start a nighttime routine: herbal tea, dim lights, no screens.'],                 tip: 'Better sleep = better glow. Try it tonight!' },
      { day: 13, title: 'Fresh Air & Movement', tasks: ['Spend 20+ minutes outside today.'],                                                tip: 'Step outside, take a deep breath, and enjoy!' },
      { day: 14, title: 'Treat Yourself',        tasks: ['Buy or do something small that makes you happy.'],                                tip: "You deserve it, mama — what's your treat today?" },
    ],
    workouts: [
      { label: 'Core Focus (15 min)',               items: ['Dead bug (x10)', 'Heel taps (x10)', 'Glute bridge (x15)', 'Side planks (20 sec each side)'] },
      { label: 'Lower Body Strength (20 min)',      items: ['Squats (x15)', 'Reverse lunges (x10 each leg)', 'Calf raises (x20)', 'Glute bridge pulses'] },
      { label: 'Mobility Flow + Walk (15–20 min)',  items: ['Light walk', 'Stretch sequence', 'Hip circles', 'Thoracic twist'] },
      { label: 'Core + Posture Reset (15 min)',     items: ['Seated rows (band or towel)', 'Bird-dog (x10)', 'Wall push-ups', 'Belly breaths'] },
      { label: 'Lower Body Burn (20 min)',          items: ['Step-ups', 'Curtsy lunges', 'Side-lying leg lifts', 'Glute bridge hold (30 sec)'] },
      { label: 'Recovery Yoga Flow (15 min)',       items: ['Gentle stretches', 'Hip openers', 'Breathwork'] },
      { label: 'Rest / Journal & Reflect',          items: ['No movement required', 'Write in your journal'] },
    ],
    meals: [
      { breakfast: 'Protein smoothie (granola + sliced almonds)',  lunch: 'Chicken + avocado bowl',                      snack: 'Rice crackers + cheese',         dinner: 'Grilled steak + mashed potatoes + steamed broccoli' },
      { breakfast: 'Whole-grain waffles + fresh blueberries',      lunch: 'Quinoa + black bean bowl + corn + salsa',     snack: 'Cheese sticks + whole-grain crackers', dinner: 'Rice + veggie stir-fry' },
      { breakfast: 'Scrambled eggs + sautéed spinach + mushrooms', lunch: 'Pasta + spinach + tomato sauce',              snack: 'Apple slices + cheddar cheese',   dinner: 'Salmon + broccoli' },
      { breakfast: 'Oats + chia + banana',                         lunch: 'Turkey + Swiss sandwich w/ lettuce + tomato', snack: 'Trail mix',                       dinner: 'Chicken stir-fry + rice' },
      { breakfast: 'Chia pudding',                                  lunch: 'Grilled chicken wrap',                        snack: 'Yogurt + honey',                  dinner: 'Baked cod + lemon + quinoa + green beans' },
      { breakfast: 'Smoothie',                                      lunch: 'Yogurt with granola',                         snack: 'Apple slices',                    dinner: 'Beef stir-fry + bell peppers + brown rice' },
      { breakfast: 'Protein pancakes',                              lunch: 'Rice cakes with almond butter',               snack: 'Popcorn',                         dinner: 'Grilled pork chops + sweet potato mash + sautéed spinach' },
    ],
    csec: [
      { day: 'MON', note: 'Replace dead bug, heel taps, side planks with belly breathing or glute bridges.' },
      { day: 'TUE', note: 'If lunges strain incision, sub with wall sits or step-backs.' },
      { day: 'WED', note: 'Mobility focused — no core tension. Light walk is perfect.' },
      { day: 'THU', note: 'Do wall press holds instead of push-ups if uncomfortable.' },
      { day: 'FRI', note: 'Sub curtsy lunges with glute bridges if needed.' },
      { day: 'SAT', note: 'Stick with gentle yoga flows only.' },
      { day: 'SUN', note: 'No movement required — rest and journal.' },
    ],
  },
  {
    number: 3, label: 'Week 3', title: 'Strength & Confidence', subtitle: 'Cardio Bursts + Toning',
    days: [
      { day: 15, title: 'Power Walk',          tasks: ['Walk for 20 minutes at a brisk pace.'],                        tip: 'Moving = glowing!' },
      { day: 16, title: 'Affirmation Day',     tasks: ['Say 3 positive affirmations out loud.'],                       tip: 'Confidence starts with your words — own them!' },
      { day: 17, title: 'Healthy Swap',        tasks: ['Replace one processed food with a whole, nutritious option.'],  tip: 'Small changes = big results!' },
      { day: 18, title: 'Posture Check',       tasks: ['Stand tall, shoulders back, chin up.'],                        tip: 'Confidence starts with how you carry yourself!' },
      { day: 19, title: 'Fun Movement',        tasks: ['Dance, play a sport, or try a new workout.'],                  tip: 'Movement should be fun — get creative!' },
      { day: 20, title: 'Social Recharge',     tasks: ['Call or meet up with a friend for positive energy.'],          tip: 'Connection fuels the soul!' },
      { day: 21, title: 'Digital Detox 2.0',  tasks: ['No social media scrolling for the entire day.'],               tip: 'More presence, less distraction!' },
    ],
    workouts: [
      { label: 'Cardio + Core (20 min)',             items: ['March in place (1 min)', 'Heel taps', 'Modified jumping jacks', 'Plank on knees (20 sec)'] },
      { label: 'Glute + Core Burner (20 min)',       items: ['Glute bridges (x20)', 'Donkey kicks', 'Side leg lifts', 'Crunch hold'] },
      { label: 'Active Stretching + Walk (20 min)',  items: ['10 min brisk walk', '10 min stretch'] },
      { label: 'Full Body Flow (20 min)',             items: ['Squat to reach', 'Bird-dog', 'Side plank dips', 'Low impact cardio burst'] },
      { label: 'Mini Circuit (20 min)',               items: ['2 rounds: 15 squats, 10 lunges', '10-sec high knees, 15 bridges', '30-sec wall sit'] },
      { label: 'Stretch + Foam Roll (15 min)',        items: ['Full body stretch', 'Foam rolling major muscle groups'] },
      { label: 'Rest / Face Mask + Journal',          items: ['No workout required', 'Pamper yourself!'] },
    ],
    meals: [
      { breakfast: 'Chia pudding',        lunch: 'Chicken stir-fry',     snack: 'Banana + peanut butter', dinner: 'Grilled turkey burgers + sweet potato fries + coleslaw' },
      { breakfast: 'Eggs + toast',        lunch: 'Rice bowl + veggies',  snack: 'Trail mix',              dinner: 'Turkey + green beans' },
      { breakfast: 'Smoothie + granola',  lunch: 'Grilled fish wrap',    snack: 'Fruit + yogurt',         dinner: 'Rice + veggie curry' },
      { breakfast: 'Protein oats',        lunch: 'Quinoa + black beans', snack: 'Apple + almond butter',  dinner: 'Baked salmon + quinoa + roasted asparagus' },
      { breakfast: 'Protein pancakes',    lunch: 'Salmon + couscous',    snack: 'Cheese + crackers',      dinner: 'Grilled chicken fajitas + bell peppers + whole-grain tortillas' },
      { breakfast: 'Smoothie bowl',       lunch: 'Stir-fry noodles',     snack: 'Hummus + veggies',       dinner: 'Baked potatoes + grilled chicken' },
      { breakfast: 'Avocado toast + egg', lunch: 'Tuna + salad',         snack: 'Fruit salad',            dinner: 'Baked chicken + sweet potato wedges + steamed broccoli' },
    ],
    csec: [
      { day: 'MON', note: 'Replace with walking + breathing; no jumping jacks or planks.' },
      { day: 'TUE', note: 'Replace donkey kicks and crunch hold with glute bridges.' },
      { day: 'WED', note: 'No modifications needed — walking and stretching are perfect.' },
      { day: 'THU', note: 'Sub side plank dips and cardio bursts with glute work.' },
      { day: 'FRI', note: 'High knees and wall sits can stress core; sub with basic squats and glute bridges.' },
      { day: 'SAT', note: 'Stay off belly area during foam rolling.' },
      { day: 'SUN', note: 'Rest day — face mask and journaling only.' },
    ],
  },
  {
    number: 4, label: 'Week 4', title: 'Mindset & Glow', subtitle: 'Total Glow-Up Challenge',
    days: [
      { day: 22, title: 'Deep Breathing',       tasks: ['Try 5 minutes of deep breathing or meditation.'],          tip: 'Calm mind, glowing skin!' },
      { day: 23, title: 'Strength Workout',     tasks: ['Do a 20-minute strength training session.'],               tip: 'Strong mama, strong glow!' },
      { day: 24, title: 'Hydration Reset',      tasks: ['Drink an extra 2 glasses of water today.'],                tip: 'Water = energy & radiance!' },
      { day: 25, title: 'Play Time',            tasks: ['Have fun with your kids or by yourself — just play!'],     tip: 'Joy keeps you youthful!' },
      { day: 26, title: 'Fresh Start',          tasks: ['Clean & reset your most-used space.'],                     tip: 'A fresh space = a fresh mind!' },
      { day: 27, title: 'Compliment Challenge', tasks: ['Give 3 genuine compliments today.'],                       tip: 'Kindness makes you shine!' },
      { day: 28, title: 'Self-Reflection',      tasks: ['Journal about your glow-up journey.'],                     tip: "Celebrate how far you've come!" },
      { day: 29, title: 'Laugh More',           tasks: ['Watch or listen to something that makes you laugh.'],      tip: 'Laughter is the best glow-up trick!' },
      { day: 30, title: '🎉 Celebrate YOU!',   tasks: ['Look in the mirror & appreciate your progress.'],          tip: 'You did it, Mama! Keep glowing!' },
    ],
    workouts: [
      { label: 'Full Body Burn (20–30 min)',     items: ['Combo of squats, bridges, jacks, planks'] },
      { label: 'Targeted Toning (20 min)',       items: ['Lower body blast + light cardio bursts'] },
      { label: 'Recovery Flow (15 min)',         items: ['Yoga', 'Deep core engagement'] },
      { label: 'Challenge Yourself (30–40 min)', items: ["Repeat your fave week's workout"] },
      { label: 'Cardio + Abs (20 min)',          items: ['Jump rope / march', 'Core circuit'] },
      { label: 'Stretch + Reflect (15 min)',     items: ['Full body stretch', 'Gratitude reflection'] },
      { label: 'Glow Reset Day',                 items: ['Light walk', 'Hydration', 'Pamper yourself'] },
    ],
    meals: [
      { breakfast: 'Protein smoothie bowl',    lunch: 'Turkey + cheese wrap + lettuce + tomato',  snack: 'Hummus + carrot sticks', dinner: 'Stuffed peppers' },
      { breakfast: 'Tofu scramble + toast',    lunch: 'Tuna salad on mixed greens + vinaigrette', snack: 'Rice cakes + PB',        dinner: 'Baked salmon + quinoa + steamed broccoli' },
      { breakfast: 'Chia parfait',             lunch: 'Stir-fry rice',                            snack: 'Energy bites',           dinner: 'Grilled turkey burgers + sweet potato fries + coleslaw' },
      { breakfast: 'Oats + banana + cinnamon', lunch: 'Quinoa salad',                             snack: 'Apple + cheese',         dinner: 'Grilled chicken + steamed veggies' },
      { breakfast: 'Pancakes + boiled egg',    lunch: 'Pasta salad + spinach',                    snack: 'Yogurt',                 dinner: 'Baked salmon + roasted veggies' },
      { breakfast: 'Green smoothie',           lunch: 'Veggie wrap + lentils',                    snack: 'Popcorn',                dinner: 'Chicken curry + rice' },
      { breakfast: 'Smoothie bowl',            lunch: 'Chickpea bowl',                            snack: 'Crackers + hummus',      dinner: 'Comfort meal of choice 🤍' },
    ],
    csec: [
      { day: 'MON', note: 'Replace with bridges and squats only if pain-free; skip jacks and planks.' },
      { day: 'TUE', note: 'Skip cardio bursts; substitute with static glute bridge holds.' },
      { day: 'WED', note: 'Stick to breathwork and gentle stretches only.' },
      { day: 'THU', note: 'Only repeat Week 1 or 2 workouts if feeling strong.' },
      { day: 'FRI', note: 'Too much impact — avoid jump rope until cleared by doctor.' },
      { day: 'SAT', note: 'Full body stretch is great for recovery.' },
      { day: 'SUN', note: 'Focus on rest, hydration, and gentle self-care.' },
    ],
  },
];

const REFLECTION_QUESTIONS = [
  'What was your biggest takeaway from this challenge?',
  'How has your mindset, body, or confidence changed?',
  'Which new habits will you continue?',
  'What was the hardest part of the challenge, and how did you push through it?',
  'What part of your routine are you most proud of sticking to?',
  "What's your next goal after completing this challenge?",
];

// ─── C-Section accordion ──────────────────────────────────────────────────────
function CsecAccordion({ mods }: { mods: { day: string; note: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden mt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-muted/50 text-left hover:bg-muted transition-colors"
      >
        <span className="text-base">⚠️</span>
        <span className="font-semibold text-sm text-foreground flex-1">C-Section Safety Modifications</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 py-4 space-y-3 bg-background">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Always check with your doctor before starting any postpartum workouts, especially after a C-section.
            If you feel pain, pressure, or pulling near your incision, stop immediately. Healing comes first. 🤍
          </p>
          {mods.map(({ day, note }) => (
            <div key={day} className="flex gap-3 items-start">
              <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-0.5 rounded shrink-0 mt-0.5">{day}</span>
              <p className="text-sm text-foreground leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Postpartum 30-Day Glow-Up Challenge ─────────────────────────────────────
function PostpartumMealPlan() {
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeTab, setActiveTab] = useState<'Daily Tasks' | 'Workout Plan' | 'Meal Plan' | 'Reflection'>('Daily Tasks');
  const week = CHALLENGE_WEEKS[activeWeek];

  const handleDownload = () => {
    window.open(
      'https://drive.google.com/uc?export=download&id=10xNUx6FALPpKGjm89jil4-If-UlOoUmS',
      '_blank',
      'noopener,noreferrer'
    );
  };

  // ⚠️ Replace with the actual thumbnail src used for the 30-day glow-up
  // video course in your app — find it in your recipeData or videoData file
  const COVER_IMAGE_SRC = '/lovable-uploads/30-day-glow-up-cover.jpg';

  return (
    <div>
      {/* Cover image — same full-width hero as existing recipe detail pages */}
      <div className="w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-2xl mb-6">
        <img
          src={COVER_IMAGE_SRC}
          alt="30-Day Mom Glow-Up Challenge"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Badge row — matches "Soups · 30 min prep" */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge className="bg-[#B5651D] hover:bg-[#8B4513] text-white rounded-full px-3 py-1 text-xs font-semibold">
          Postpartum
        </Badge>
        <div className="flex items-center gap-1.5 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>30 day challenge</span>
        </div>
      </div>

      {/* Title + description */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
        30-Day Mom Glow-Up Challenge
      </h1>
      <p className="text-muted-foreground text-base mb-6 leading-relaxed max-w-2xl">
        Your step-by-step guide to feeling stronger, more confident, and full of energy.
        No overwhelm — just simple, doable steps to glow from the inside out. 🌟
      </p>

      {/* Stats row — matches Total Time / Servings / Difficulty */}
      <div className="flex items-center gap-6 mb-6 flex-wrap">
        {[
          { icon: <Clock className="h-4 w-4 text-[#B5651D]" />,   label: 'Duration', value: '30 Days'    },
          { icon: <BookOpen className="h-4 w-4 text-[#B5651D]" />, label: 'Weeks',    value: '4 Weeks'    },
          { icon: <span className="text-sm">🏆</span>,              label: 'Level',    value: 'All Levels' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#B5651D]/30 flex items-center justify-center">{icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-semibold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Keyword tags */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['Core Restore', 'Strength', 'Nutrition', 'Mindset', 'Recovery', 'Self-Care'].map(tag => (
          <span key={tag} className="border border-border text-muted-foreground rounded-full px-3 py-1 text-xs">{tag}</span>
        ))}
      </div>

      {/* Action buttons — matches Save Recipe / Print / Share */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-[#B5651D] hover:bg-[#8B4513] text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          <Download className="h-4 w-4" />
          Download PDF Guide
        </button>
        <button className="flex items-center gap-2 border border-border hover:bg-muted px-4 py-2.5 rounded-full text-sm font-medium text-foreground transition-colors">
          <Printer className="h-4 w-4" />
          Print
        </button>
        <button className="flex items-center justify-center border border-border hover:bg-muted w-10 h-10 rounded-full transition-colors">
          <Share2 className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* How to use banner */}
      <div className="bg-muted/40 border border-border rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-foreground mb-2">📋 How to use this challenge</p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Follow the daily tasks to improve your energy, confidence, and health.</li>
          <li>Use the trackers and checklists to stay consistent.</li>
          <li>Take notes on how you feel each week in the Reflection section.</li>
          <li>Always check in with the community for updates.</li>
          <li>Have fun and tag <strong className="text-[#B5651D]">@Catalyst_Mom</strong> in your progress!</li>
        </ul>
      </div>

      {/* Week selector */}
      <div className="flex gap-2 flex-wrap mb-5">
        {CHALLENGE_WEEKS.map((w, i) => (
          <button
            key={i}
            onClick={() => { setActiveWeek(i); setActiveTab('Daily Tasks'); }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
              activeWeek === i
                ? 'bg-[#B5651D] text-white border-[#B5651D]'
                : 'bg-background text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            {w.label}: {w.title}
          </button>
        ))}
      </div>

      {/* Week label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#B5651D] text-white flex items-center justify-center font-bold text-sm shrink-0">
          W{week.number}
        </div>
        <div>
          <h2 className="font-bold text-foreground text-lg leading-tight">{week.title}</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{week.subtitle}</p>
        </div>
      </div>

      {/* Content tabs — matches Recipe / Nutrition / Notes */}
      <div className="bg-muted/50 rounded-xl p-1 flex gap-1 mb-6 flex-wrap">
        {(['Daily Tasks', 'Workout Plan', 'Meal Plan', 'Reflection'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Daily Tasks ── */}
      {activeTab === 'Daily Tasks' && (
        <div className="border border-border rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="h-5 w-5 text-[#B5651D]" />
                <h3 className="font-bold text-foreground text-lg">Daily Challenges</h3>
              </div>
              <div className="space-y-5">
                {week.days.map(({ day, title, tasks, tip }) => (
                  <div key={day} className="flex gap-3 items-start border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-[#B5651D] text-white flex items-center justify-center text-xs font-bold shrink-0">{day}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm mb-1">{title}</p>
                      <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-0.5">
                        {tasks.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                      <p className="text-xs text-[#B5651D] italic mt-2">✨ {tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-muted/20">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[#B5651D] text-lg">💡</span>
                <h3 className="font-bold text-foreground text-lg">Week {week.number} Guide</h3>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl bg-background border border-border p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">Focus for this week</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{week.subtitle} — {week.title.toLowerCase()}. Build the habit one day at a time.</p>
                </div>
                <div className="rounded-xl bg-background border border-border p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Daily checklist</p>
                  <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                    {['Complete your daily challenge', 'Do your weekly workout', 'Follow the meal plan', 'Drink 8+ glasses of water', 'Share progress @Catalyst_Mom'].map(item => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded border border-[#B5651D] inline-block shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-[#B5651D]/10 border border-[#B5651D]/20 p-4">
                  <p className="text-sm font-semibold text-[#8B4513] mb-1">💪 Remember</p>
                  <p className="text-sm text-[#8B4513] leading-relaxed">Progress over perfection. Every small action adds up to a big glow-up. You've got this, mama.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Workout Plan ── */}
      {activeTab === 'Workout Plan' && (
        <div className="border border-border rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[#B5651D] text-lg">💪</span>
                <h3 className="font-bold text-foreground text-lg">Weekly Schedule</h3>
              </div>
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day, i) => (
                  <div key={day} className="flex gap-3 items-start border-b border-border pb-4 last:border-0 last:pb-0">
                    <span className="bg-[#B5651D] text-white text-xs font-bold px-2 py-1 rounded-md w-10 text-center shrink-0 mt-0.5">{day}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground mb-1">{week.workouts[i]?.label}</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside leading-relaxed">
                        {week.workouts[i]?.items.map((ex, j) => <li key={j}>{ex}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-muted/20">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[#B5651D] text-lg">📌</span>
                <h3 className="font-bold text-foreground text-lg">Workout Notes</h3>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-background border border-border p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">Before you start</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside leading-relaxed">
                    <li>Warm up 2–3 minutes before each workout</li>
                    <li>Listen to your body — rest if something hurts</li>
                    <li>Stay hydrated throughout your session</li>
                    <li>Cool down and stretch after every workout</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-background border border-border p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">Equipment needed</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside leading-relaxed">
                    <li>Yoga mat</li>
                    <li>Resistance band (optional)</li>
                    <li>Foam roller (optional)</li>
                    <li>Comfortable, supportive footwear</li>
                  </ul>
                </div>
              </div>
              <CsecAccordion mods={week.csec} />
            </div>
          </div>
        </div>
      )}

      {/* ── Meal Plan ── */}
      {activeTab === 'Meal Plan' && (
        <div className="border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-14">Day</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">🌅 Breakfast</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">🥗 Lunch</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">🍎 Snack</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">🍽️ Dinner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DAYS_OF_WEEK.map((day, i) => (
                  <tr key={day} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <td className="px-4 py-3"><span className="bg-[#B5651D] text-white text-xs font-bold px-2 py-1 rounded-md">{day}</span></td>
                    <td className="px-4 py-3 text-sm text-foreground leading-snug">{week.meals[i]?.breakfast}</td>
                    <td className="px-4 py-3 text-sm text-foreground leading-snug">{week.meals[i]?.lunch}</td>
                    <td className="px-4 py-3 text-sm text-foreground leading-snug">{week.meals[i]?.snack}</td>
                    <td className="px-4 py-3 text-sm text-foreground leading-snug">{week.meals[i]?.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-muted/30 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              💡 <strong>Nutrition tip:</strong> This plan is a flexible guide — swap proteins and vegetables based on what's available. Focus on whole foods, adequate protein, and staying hydrated. Consult your healthcare provider for specific postpartum dietary needs.
            </p>
          </div>
        </div>
      )}

      {/* ── Reflection ── */}
      {activeTab === 'Reflection' && (
        <div className="border border-border rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[#B5651D] text-lg">✍️</span>
                <h3 className="font-bold text-foreground text-lg">Final Reflection</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                You completed 30 days. Take a moment to celebrate how far you've come and set your intentions going forward.
              </p>
              <div className="space-y-4">
                {REFLECTION_QUESTIONS.map((q, i) => (
                  <div key={i} className="flex gap-3 items-start border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full bg-[#B5651D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-sm text-foreground leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-muted/20">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">🌟</span>
                <h3 className="font-bold text-foreground text-lg">Celebrate Your Wins</h3>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl bg-background border border-border p-4">
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    "Wellness isn't just about physical health — it's also about mental, emotional, and spiritual health."
                  </p>
                  <p className="text-xs text-[#B5651D] font-semibold mt-2 tracking-wide">— MORGAN MAXWELL</p>
                </div>
                <div className="rounded-xl bg-[#B5651D]/10 border border-[#B5651D]/20 p-4">
                  <p className="text-sm font-bold text-[#8B4513] mb-2">You're unstoppable, Mama 🤍</p>
                  <p className="text-sm text-[#8B4513] leading-relaxed mb-3">
                    Tag <strong>@Catalyst_Mom</strong> and share your glow-up! Your journey inspires other mamas.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-[#B5651D] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#8B4513] transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Download Full PDF Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Recipes page ────────────────────────────────────────────────────────
const Recipes = () => {
  const { stageInfo } = useContentFilter();

  // Detect postpartum — stageInfo.phase comes back as "Postpartum" from useContentFilter
  const isPostpartum = stageInfo?.phase?.toLowerCase() === 'postpartum';

  // ── Postpartum users: skip everything, show meal plan only ───────────────
  if (isPostpartum) {
    return (
      <PageLayout>
        <div className="container px-4 mx-auto py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Meal Plan</h1>
            <p className="text-muted-foreground">
              Your 30-day postpartum nutrition and wellness plan
            </p>
          </div>
          <PostpartumMealPlan />
        </div>
      </PageLayout>
    );
  }

  // ── All other stages: existing behaviour ─────────────────────────────────
  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nourishing Recipes</h1>
            <p className="text-muted-foreground mb-4 md:mb-0">
              {stageInfo
                ? `Recipes designed for your ${stageInfo.phase.toLowerCase()} journey`
                : 'Delicious and nutritious meals designed for your motherhood journey'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search recipes..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon" aria-label="Filter" disabled title="Filter coming soon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="plans" className="mb-8">
          <TabsList>
            <TabsTrigger value="plans">Meal Plans</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="plans" className="mt-6">
            <JourneySpecificMealPlans mealPlans={mealPlans} />
          </TabsContent>
          <TabsContent value="favorites">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Your Favorite Recipes</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Save your favorite recipes to see them here.
              </p>
              <Button asChild>
                <a href="/recipes">Browse Meal Plans</a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Recipes;
