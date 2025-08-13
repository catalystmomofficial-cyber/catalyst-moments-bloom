export type GlowVideo = {
  id: string;
  title: string;
  url: string;
  duration?: string;
  description?: string;
};

export const GLOW_AND_GO_VIDEOS: GlowVideo[] = [
  {
    id: "intro",
    title: "Program Introduction",
    url: "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/glow%20and%20go/Intro.mp4",
    duration: "2 min",
    description: "Quick overview of what to expect in Glow & Go."
  },
  {
    id: "trimester-1",
    title: "1st Trimester",
    url: "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/glow%20and%20go/1st%20trimester.mp4",
    description: "Safe movement for early pregnancy."
  },
  {
    id: "trimester-2",
    title: "2nd Trimester",
    url: "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/glow%20and%20go/2nd%20trimester.mp4",
    description: "Build strength while supporting your bump."
  },
  {
    id: "trimester-3",
    title: "3rd Trimester",
    url: "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/glow%20and%20go/3rd%20trimester.mp4",
    description: "Prepare your body for birth with safe exercises."
  },
  {
    id: "core-pelvic",
    title: "Core & Pelvic Booster",
    url: "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/glow%20and%20go/Core%20%26%20pelvic%20booster.mp4",
    description: "Gentle core and pelvic floor routine."
  },
  {
    id: "daily-yoga",
    title: "Daily Yoga Exercises",
    url: "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/glow%20and%20go/Daily%20yoga%20exercises.mp4",
    description: "Daily prenatal yoga to improve mobility."
  }
];
