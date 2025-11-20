export interface Exercise {
  id: string;
  name: string;
  duration: string;
  instructions: string[];
  benefits: string[];
  imageUrl?: string;
  category: string;
  trimester: number;
}

export interface TrimesterProgram {
  id: string;
  trimester: number;
  title: string;
  subtitle: string;
  weeks: string;
  goal: string;
  description: string;
  whatToDo: string[];
  whatNotToDo: string[];
  exercises: Exercise[];
  imageUrl?: string;
  routineTime: string;
}

export const birthBallExercises: Exercise[] = [
  // Trimester 1 Exercises
  {
    id: "pelvic-tilts-1",
    name: "Pelvic Tilts (front to back)",
    duration: "1 min",
    category: "Mobility + Posture",
    trimester: 1,
    instructions: [
      "Sit upright on the birth ball with feet flat on the floor, hip-width apart",
      "Place hands on your hips or rest them on your thighs",
      "Slowly tilt your pelvis forward, arching your lower back slightly",
      "Then tilt your pelvis backward, rounding your lower back",
      "Move gently and smoothly, breathing deeply throughout"
    ],
    benefits: [
      "Eases tension in lower back",
      "Improves pelvic flexibility",
      "Helps maintain neutral spine alignment",
      "Prepares core for pregnancy changes"
    ]
  },
  {
    id: "seated-posture-hold-1",
    name: "Seated Posture Hold",
    duration: "2 mins",
    category: "Mobility + Posture",
    trimester: 1,
    instructions: [
      "Sit tall on the ball with your feet firmly planted",
      "Engage your core lightly (imagine hugging baby gently)",
      "Roll shoulders back and down",
      "Keep chin parallel to the ground",
      "Breathe deeply and hold this aligned position"
    ],
    benefits: [
      "Supports proper posture as belly grows",
      "Strengthens core stability",
      "Reduces strain on lower back",
      "Improves body awareness"
    ]
  },
  {
    id: "seated-arm-reaches-1",
    name: "Seated Arm Reaches",
    duration: "2 mins",
    category: "Mobility + Posture",
    trimester: 1,
    instructions: [
      "Sit upright on the ball with feet grounded",
      "Extend one arm overhead, reaching toward the ceiling",
      "Feel a gentle stretch along your side body",
      "Hold for a few breaths, then switch sides",
      "Keep your core engaged and avoid leaning too far"
    ],
    benefits: [
      "Opens up rib cage for better breathing",
      "Relieves upper back tension",
      "Improves shoulder mobility",
      "Helps with posture correction"
    ]
  },
  {
    id: "hip-circles-1",
    name: "Hip Circles",
    duration: "2 mins",
    category: "Mobility + Posture",
    trimester: 1,
    instructions: [
      "Sit on the ball with feet hip-width apart",
      "Slowly circle your hips in one direction (clockwise)",
      "Make the circles as smooth and controlled as possible",
      "After 1 minute, reverse direction (counterclockwise)",
      "Keep your upper body stable and relaxed"
    ],
    benefits: [
      "Opens hips and increases mobility",
      "Relaxes pelvic floor muscles",
      "Relieves lower back tension",
      "Improves circulation in pelvic area"
    ]
  },
  {
    id: "deep-breathing-1",
    name: "Deep Breathing",
    duration: "2-3 mins",
    category: "Mobility + Posture",
    trimester: 1,
    instructions: [
      "Sit comfortably on the ball with good posture",
      "Place one hand on your chest, one on your belly",
      "Inhale slowly through your nose for 4 counts",
      "Exhale through your mouth for 6 counts",
      "Feel your belly expand with each inhale, relax with each exhale"
    ],
    benefits: [
      "Calms nervous system",
      "Reduces stress and anxiety",
      "Improves oxygen flow to baby",
      "Prepares breathing techniques for labor"
    ]
  },

  // Trimester 2 Exercises
  {
    id: "supported-squats-2",
    name: "Supported Squats",
    duration: "2 mins",
    category: "Strength + Mobility",
    trimester: 2,
    instructions: [
      "Stand with the ball against a wall behind you",
      "Lean back gently against the ball for support",
      "Place feet hip-width apart, toes slightly out",
      "Slowly bend knees and lower into a squat position",
      "Keep knees aligned over toes, push through heels to stand"
    ],
    benefits: [
      "Strengthens legs and glutes",
      "Opens pelvis and hips",
      "Builds stamina for labor",
      "Improves lower body stability"
    ]
  },
  {
    id: "seated-posture-hold-2",
    name: "Seated Posture Hold",
    duration: "2 mins",
    category: "Strength + Mobility",
    trimester: 2,
    instructions: [
      "Sit tall on the ball with your feet firmly planted",
      "Engage your core lightly to support growing belly",
      "Roll shoulders back and keep chest open",
      "Maintain this aligned position while breathing deeply",
      "Focus on keeping hips slightly higher than knees"
    ],
    benefits: [
      "Maintains core strength",
      "Supports changing center of gravity",
      "Prevents lower back pain",
      "Improves posture awareness"
    ]
  },
  {
    id: "side-to-side-rocking-2",
    name: "Side-to-Side Rocking",
    duration: "2 mins",
    category: "Strength + Mobility",
    trimester: 2,
    instructions: [
      "Sit on the ball with feet planted firmly",
      "Gently rock your hips from side to side",
      "Keep the movement smooth and controlled",
      "Let your weight shift naturally from one hip to the other",
      "Maintain good posture throughout"
    ],
    benefits: [
      "Relieves hip and lower back tension",
      "Improves lateral hip mobility",
      "Soothes discomfort from growing belly",
      "Helps with pelvic alignment"
    ]
  },
  {
    id: "hip-circles-2",
    name: "Hip Circles",
    duration: "2 mins",
    category: "Strength + Mobility",
    trimester: 2,
    instructions: [
      "Sit centered on the ball",
      "Make smooth, circular motions with your hips",
      "Circle in one direction for 1 minute",
      "Reverse and circle in the opposite direction",
      "Keep movements gentle and controlled"
    ],
    benefits: [
      "Increases hip flexibility",
      "Helps baby find optimal position",
      "Reduces pelvic tension",
      "Prepares pelvis for delivery"
    ]
  },
  {
    id: "breathing-arm-swings-2",
    name: "Breathing + Arm Swings",
    duration: "2 mins",
    category: "Strength + Mobility",
    trimester: 2,
    instructions: [
      "Sit upright on the ball",
      "Inhale as you open arms wide to the sides",
      "Exhale as you bring arms forward and cross them gently",
      "Continue this flowing movement with your breath",
      "Keep shoulders relaxed and movements smooth"
    ],
    benefits: [
      "Opens chest and shoulders",
      "Improves breathing capacity",
      "Releases upper back tension",
      "Promotes relaxation and body awareness"
    ]
  },

  // Trimester 3 Exercises
  {
    id: "slow-bounces-3",
    name: "Slow Bounces",
    duration: "1-2 mins",
    category: "Labor Prep",
    trimester: 3,
    instructions: [
      "Sit on the ball with feet firmly planted",
      "Stay close to a wall or chair for support",
      "Gently bounce by lifting and lowering your hips slightly",
      "Keep movements very small and controlled",
      "Stop immediately if you feel any discomfort"
    ],
    benefits: [
      "Encourages baby to move into optimal position",
      "Relieves pressure on pelvis and back",
      "Promotes cervical dilation readiness",
      "Helps with pain management"
    ]
  },
  {
    id: "seated-figure-8s-3",
    name: "Seated Figure-8s",
    duration: "2 mins",
    category: "Labor Prep",
    trimester: 3,
    instructions: [
      "Sit on the ball with good posture",
      "Move your hips in a figure-8 pattern",
      "Go slowly and smoothly through the motion",
      "Focus on keeping the movement fluid",
      "Reverse direction halfway through"
    ],
    benefits: [
      "Increases pelvic mobility significantly",
      "Helps baby rotate into birth position",
      "Opens hips for labor",
      "Reduces pelvic floor tension"
    ]
  },
  {
    id: "pelvic-tilts-all-fours-3",
    name: "Pelvic Tilts on All Fours (using ball for support)",
    duration: "2 mins",
    category: "Labor Prep",
    trimester: 3,
    instructions: [
      "Get on hands and knees with the ball in front of you",
      "Rest your hands or forearms on the ball",
      "Arch your back gently (cat stretch)",
      "Then round your back (cow stretch)",
      "Move slowly with your breath"
    ],
    benefits: [
      "Relieves back pain and pressure",
      "Helps baby move off your spine",
      "Strengthens core muscles",
      "Prepares body for labor positions"
    ]
  },
  {
    id: "forward-lean-breathing-3",
    name: "Forward Lean with Breathing",
    duration: "2 mins",
    category: "Labor Prep",
    trimester: 3,
    instructions: [
      "Kneel in front of the ball",
      "Lean forward and rest your upper body on the ball",
      "Let your belly hang comfortably",
      "Take slow, deep breaths",
      "Relax completely into the position"
    ],
    benefits: [
      "Calms nervous system",
      "Takes pressure off lower back",
      "Encourages optimal fetal positioning",
      "Excellent position for managing contractions"
    ]
  },
  {
    id: "butterfly-stretch-3",
    name: "Butterfly Stretch (optional)",
    duration: "1-2 mins",
    category: "Labor Prep",
    trimester: 3,
    instructions: [
      "Sit on the floor with the ball nearby for support",
      "Bring the soles of your feet together",
      "Let your knees fall gently to the sides",
      "Use the ball behind your back for support if needed",
      "Hold the stretch, breathing deeply"
    ],
    benefits: [
      "Opens hips and inner thighs",
      "Prepares pelvis for delivery",
      "Relieves groin tension",
      "Promotes flexibility in pelvic area"
    ]
  },

  // Final Weeks Exercises (36-40)
  {
    id: "hip-circles-final",
    name: "Seated Hip Circles",
    duration: "2 min",
    category: "Final Weeks",
    trimester: 3,
    instructions: [
      "Sit centered on the ball with feet grounded",
      "Make slow, wide circles with your hips",
      "Complete circles in both directions",
      "Focus on smooth, continuous movement",
      "Breathe deeply throughout"
    ],
    benefits: [
      "Opens hips for labor",
      "Relaxes pelvic floor",
      "Encourages baby's descent",
      "Relieves pelvic pressure"
    ]
  },
  {
    id: "figure-8s-final",
    name: "Seated Figure-8s",
    duration: "2 min",
    category: "Final Weeks",
    trimester: 3,
    instructions: [
      "Sit upright on the ball",
      "Trace a figure-8 pattern with your hips",
      "Keep movements fluid and controlled",
      "Practice in both directions",
      "Stay relaxed and breathe naturally"
    ],
    benefits: [
      "Increases pelvic mobility dramatically",
      "Helps baby rotate into position",
      "Prepares body for active labor",
      "Reduces tension in pelvic area"
    ]
  },
  {
    id: "pelvic-tilts-ball-final",
    name: "Pelvic Tilts on Ball",
    duration: "2 min",
    category: "Final Weeks",
    trimester: 3,
    instructions: [
      "Sit tall on the ball",
      "Tilt pelvis forward and backward gently",
      "Focus on the rocking motion",
      "Keep core lightly engaged",
      "Move with your breath"
    ],
    benefits: [
      "Eases back tension",
      "Strengthens core muscles",
      "Improves pelvic alignment",
      "Prepares for pushing phase"
    ]
  },
  {
    id: "forward-lean-breathing-final",
    name: "Forward Lean + Breathing",
    duration: "2 min",
    category: "Final Weeks",
    trimester: 3,
    instructions: [
      "Kneel and lean forward onto the ball",
      "Rest your upper body completely",
      "Let gravity support your belly",
      "Take slow, deep breaths",
      "Focus on total relaxation"
    ],
    benefits: [
      "Relaxes nervous system",
      "Reduces anxiety and tension",
      "Takes pressure off back",
      "Perfect for pre-labor preparation"
    ]
  },
  {
    id: "supported-squat-final",
    name: "Supported Squat Hold (Optional)",
    duration: "1–2 min",
    category: "Final Weeks",
    trimester: 3,
    instructions: [
      "Stand with ball against wall for support",
      "Place feet wider than hip-width",
      "Lower into a comfortable squat position",
      "Hold the position, breathing deeply",
      "Use ball for balance and support"
    ],
    benefits: [
      "Opens pelvis for baby's descent",
      "Strengthens legs for labor",
      "Encourages optimal fetal positioning",
      "Builds endurance for pushing"
    ]
  }
];

export const trimesterPrograms: TrimesterProgram[] = [
  {
    id: "trimester-1",
    trimester: 1,
    title: "Trimester 1: Gentle Start",
    subtitle: "Early Pregnancy (Weeks 1-12)",
    weeks: "Weeks 1-12",
    goal: "Ease tension, support posture, and prep your core for changes ahead.",
    description: "Focus on light movements and balance as your joints begin loosening due to relaxin hormone. This is the foundation stage.",
    whatToDo: [
      "Gentle hip circles",
      "Seated pelvic tilts",
      "Breathing exercises",
      "Posture adjustments for sitting (maintaining neutral spine alignment)",
      "Light stretching for the back, hips, and legs"
    ],
    whatNotToDo: [
      "Avoid bouncing or excessive movement that might put pressure on your lower abdomen",
      "No deep stretching that could overstretch ligaments"
    ],
    exercises: birthBallExercises.filter(ex => ex.trimester === 1 && ex.category === "Mobility + Posture"),
    routineTime: "10 minutes total"
  },
  {
    id: "trimester-2",
    trimester: 2,
    title: "Trimester 2: Build Strength + Stay Mobile",
    subtitle: "Mid Pregnancy (Weeks 13-26)",
    weeks: "Weeks 13-26",
    goal: "Support hips and legs, relieve pressure, and stay active.",
    description: "Your belly starts to grow and core balance shifts. Use the ball for hip mobility and posture support during this active phase.",
    whatToDo: [
      "Hip rocking and gentle pelvic tilts",
      "Gentle bounces with support (if feeling good)",
      "Relaxation techniques while sitting on the ball",
      "Incorporating light squats and lunges (holding onto a stable surface for support)"
    ],
    whatNotToDo: [
      "Avoid overly fast movements or bouncing that could strain the pelvic floor",
      "Avoid exercises that put too much pressure on the lower back"
    ],
    exercises: birthBallExercises.filter(ex => ex.trimester === 2 && ex.category === "Strength + Mobility"),
    routineTime: "10 minutes total"
  },
  {
    id: "trimester-3",
    trimester: 3,
    title: "Trimester 3: Relax + Prep for Labor",
    subtitle: "Late Pregnancy (Weeks 27-40)",
    weeks: "Weeks 27-40",
    goal: "Open pelvis, calm your nervous system, and encourage baby's position.",
    description: "The pelvis opens and your center of gravity shifts significantly. Focus on stable movements near support (wall or chair) to prepare for labor.",
    whatToDo: [
      "Gentle rocking to ease back pain",
      "Seated pelvic tilts to relieve lower back pressure",
      "Side-to-side movement to help with hip mobility",
      "Squatting with ball support to help open the pelvis for labor preparation",
      "Breathing techniques to prepare for labor"
    ],
    whatNotToDo: [
      "No bouncing on the ball (risk of pelvic floor strain and imbalance)",
      "Avoid any fast movements or sudden jerks",
      "Don't overexert yourself; listen to your body"
    ],
    exercises: birthBallExercises.filter(ex => ex.trimester === 3 && ex.category === "Labor Prep"),
    routineTime: "10-12 minutes total"
  }
];

export const educationalContent = {
  introduction: {
    title: "Introduction",
    subtitle: "Your go-to guide for hip mobility, pelvic floor support, and preparing your body for labor.",
    content: "Using a birth ball during pregnancy offers numerous benefits, from improving hip mobility to supporting the pelvic floor and preparing for labor. This guide will walk you through trimester-specific exercises and precautions, ensuring safety for both you and your baby. Knowing when to modify movements and who to consult is crucial, especially for those considering or recovering from a C-section. Let's dive into understanding your pelvic floor and the mechanics of your changing body during pregnancy."
  },
  pelvicFloor: {
    title: "Understanding Your Pelvic Floor & Body Mechanics",
    sections: [
      {
        question: "What is the pelvic floor and why is it important during pregnancy?",
        answer: "Your pelvic floor is a group of muscles and ligaments that support your uterus, bladder, and bowels. During pregnancy, these muscles carry more weight and help stabilize your growing belly.",
        points: [
          "Supports core stability",
          "Helps with bladder control",
          "Plays a key role in labor and delivery",
          "Reduces risk of tearing during birth"
        ]
      },
      {
        question: "How birth balls can help or harm if not used correctly",
        benefits: [
          "Relieves lower back and hip pain",
          "Improves posture and pelvic alignment",
          "Helps open up the pelvis for baby to move into position"
        ],
        risks: [
          "It can strain your lower back or pelvic muscles",
          "It may cause discomfort or increase pressure on sensitive joints",
          "It could even throw off your balance if you're not sitting properly"
        ]
      },
      {
        question: "How your body changes throughout pregnancy",
        stages: [
          {
            trimester: 1,
            description: "Your joints begin loosening due to relaxin. Focus on light movements and balance."
          },
          {
            trimester: 2,
            description: "Belly starts to grow. Core balance shifts. Use the ball for hip mobility and posture support."
          },
          {
            trimester: 3,
            description: "The pelvis opens, your center of gravity is way off. Only do stable movements. Stay close to support (wall or chair)."
          }
        ]
      }
    ]
  },
  reducesTearing: {
    title: "Why These Moves Help Reduce Tearing",
    content: "These birth ball movements aren't just about comfort—they support your body in reducing the risk of tearing during delivery by:",
    benefits: [
      "Strengthening the pelvic floor for more controlled pushing",
      "Encouraging baby into optimal position for smoother labor",
      "Increasing hip mobility and pelvic flexibility",
      "Teaching breath control and relaxation to reduce tension during contractions"
    ],
    note: "Practicing these consistently (especially in the 3rd trimester) helps your body stay strong and responsive when it matters most."
  },
  earlyLabor: {
    title: "How to Use the Ball in Early Labor",
    techniques: [
      "Rock or sway gently while sitting to manage contractions",
      "Lean forward on the ball to relax between surges",
      "Use slow breathing to stay grounded and present",
      "Try hip circles to help baby rotate and descend"
    ],
    note: "These positions are mom-approved and doula-loved for staying relaxed and supported in early labor."
  },
  buyingGuide: {
    title: "Birth Ball Buying Guide",
    sizing: [
      { height: "Under 5'3\" (160 cm)", size: "55 cm" },
      { height: "5'4\"–5'10\" (162–178 cm)", size: "65 cm" },
      { height: "Over 5'10\" (178 cm)", size: "75 cm" }
    ],
    sizingTip: "When seated, your hips should be slightly higher than your knees.",
    material: [
      "Look for anti-burst material (won't pop, just deflates slowly if punctured)",
      "Choose a ball rated to hold at least 600–1000 lbs",
      "Make sure it's BPA-free and latex-free"
    ],
    grip: [
      "Non-slip surface is a must—look for textured or matte finishes",
      "Some brands offer stabilizer rings for added support"
    ],
    accessories: [
      "Hand or foot pump",
      "Measuring tape for proper inflation",
      "Stability base or ring",
      "Workout guide or chart"
    ]
  },
  safety: {
    title: "Tips for Safety and Comfort",
    sections: [
      {
        title: "Use the Ball Safely",
        tips: [
          "Always place the birth ball on a non-slip surface like a yoga mat or rug",
          "Stay close to a stable support (wall, couch, or chair) when sitting or exercising",
          "Avoid socks—barefoot or grip socks are best for traction"
        ]
      },
      {
        title: "Inflate It Right",
        tips: [
          "Your hips should be slightly higher than your knees when seated",
          "Keep the ball slightly soft, not overinflated, for better comfort and stability"
        ]
      },
      {
        title: "Know when to Pause",
        warning: "Stop immediately and contact your provider if you experience:",
        symptoms: [
          "Sharp pain",
          "Dizziness or shortness of breath",
          "Contractions (before full term)",
          "Vaginal bleeding or fluid leakage",
          "Numbness or tingling in legs"
        ]
      },
      {
        title: "Stay Hydrated & Relaxed",
        tips: [
          "Sip water before, during, and after your session",
          "Add a cool cloth nearby or use a fan if needed",
          "After exercises, take a few minutes to lie down on your side and breathe deeply—helps you relax and connect with baby"
        ]
      }
    ]
  },
  troubleshooting: {
    title: "Troubleshooting & Frequently Asked Questions",
    commonMistakes: [
      {
        mistake: "Ball is too high or too low",
        fix: "Your hips should be slightly higher than your knees when sitting. Adjust the ball size or inflation."
      },
      {
        mistake: "Slouching or poor posture",
        fix: "Sit upright, engage your core lightly, and keep feet flat on the floor."
      },
      {
        mistake: "Using the ball on slippery surfaces",
        fix: "Always place it on a yoga mat or rug to prevent slipping."
      },
      {
        mistake: "Overdoing exercises",
        fix: "Stick to short, consistent sessions. If you feel tired or sore, pause and reassess."
      }
    ],
    properUse: [
      "You feel stable, not wobbly",
      "Your knees are at a 90-degree angle or slightly lower than your hips",
      "Your core is lightly engaged, and you're not leaning backward or forward",
      "You can breathe easily and talk comfortably during movements"
    ],
    discomfort: [
      "Stop immediately. Don't push through pain",
      "Check your form — are you sitting straight? Are your feet planted?",
      "Scale back the movement or switch to gentle rocking",
      "Rest and hydrate, then try again later or the next day",
      "If discomfort continues, contact your OB, midwife, or pelvic floor therapist before continuing"
    ]
  },
  quickstart: {
    title: "Birth Ball Quickstart Checklist",
    setup: [
      "Inflate your ball to the correct height (hips slightly above knees)",
      "Place your ball on a non-slip surface (yoga mat or rug)",
      "Remove socks or wear grip socks/barefoot for stability",
      "Stay near a support surface like a wall, couch, or chair",
      "Have water nearby + set a calming playlist if you like"
    ],
    starting: [
      "Choose your current trimester in the guide",
      "Pick 3–5 moves from your trimester's suggested routine",
      "Start with 5–10 minutes total (you don't need a full workout!)",
      "Practice breathing with movement—relax, don't rush",
      "Use the \"Final Weeks Routine\" daily after 36 weeks"
    ],
    habit: [
      "Set a reminder on your phone: \"Birth Ball Time\"",
      "Stack it with something you already do (example: after brushing teeth, before bed, or during Netflix)",
      "Mark it on your Weekly Planner"
    ],
    proTip: "Even 5 minutes of gentle movement daily can help reduce pelvic tension, improve posture, and support a smoother birth."
  },
  expertTips: [
    {
      quote: "Start small and stay consistent. Even 5 minutes a day can ease back pain and help your baby get into a good position.",
      author: "Dr. Nina Lopez, OB-GYN"
    },
    {
      quote: "Your pelvic floor is working overtime during pregnancy. Using the ball correctly helps prevent strain and supports easier labor.",
      author: "Michelle Green, Pelvic Floor Physiotherapist"
    },
    {
      quote: "If you're ever unsure about a move, keep it simple: sit upright on the ball and just breathe deeply. That alone can calm your system.",
      author: "Amy J., Certified Doula"
    },
    {
      quote: "Avoid bouncing aggressively in the third trimester. Use the ball to rock and sway—this opens the pelvis and reduces tension safely.",
      author: "Dr. Jade Mensah, Prenatal Chiropractor"
    },
    {
      quote: "Hydration is key. Birth ball exercises are low impact, but they still count as movement. Always drink water before and after.",
      author: "Sara Mendez, Pregnancy Fitness Coach"
    }
  ]
};
