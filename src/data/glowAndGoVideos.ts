export type GlowVideo = {
  id: string;
  title: string;
  url: string;
  duration?: string;
  description?: string;
  coverImage?: string;
};

import professionalCover from "@/assets/glow-and-go-professional-cover.jpg";

export const GLOW_AND_GO_VIDEOS: GlowVideo[] = [
  {
    id: "intro",
    title: "Program Introduction",
    url: "course://glow and go/Intro.mp4",
    duration: "2 min",
    description: "Quick overview of what to expect in Glow & Go.",
    coverImage: professionalCover
  },
  {
    id: "trimester-1",
    title: "1st Trimester",
    url: "course://glow and go/1st trimester.mp4",
    duration: "15 min",
    description: "Safe movement for early pregnancy.",
    coverImage: professionalCover
  },
  {
    id: "trimester-2",
    title: "2nd Trimester",
    url: "course://glow and go/2nd trimester.mp4",
    duration: "20 min",
    description: "Build strength while supporting your bump.",
    coverImage: professionalCover
  },
  {
    id: "trimester-3",
    title: "3rd Trimester",
    url: "course://glow and go/3rd trimester.mp4",
    duration: "18 min",
    description: "Prepare your body for birth with safe exercises.",
    coverImage: professionalCover
  },
  {
    id: "core-pelvic",
    title: "Core & Pelvic Booster",
    url: "course://glow and go/Core & pelvic booster.mp4",
    duration: "12 min",
    description: "Gentle core and pelvic floor routine.",
    coverImage: professionalCover
  },
  {
    id: "daily-yoga",
    title: "Daily Yoga Exercises",
    url: "course://glow and go/Daily yoga exercises.mp4",
    duration: "10 min",
    description: "Daily prenatal yoga to improve mobility.",
    coverImage: professionalCover
  }
];
