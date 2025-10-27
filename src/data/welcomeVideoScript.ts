export interface VideoScene {
  id: number;
  duration: number;
  imagePrompt: string;
  narration: string;
}

export const welcomeVideoScenes: VideoScene[] = [
  {
    id: 1,
    duration: 5000,
    imagePrompt: "A warm, welcoming hero image featuring the Catalyst Mom logo with soft pink and purple gradients, professional wellness aesthetic, modern design, inspiring motherhood theme, 16:9 aspect ratio",
    narration: "Welcome to Catalyst Mom - your complete wellness companion for every stage of motherhood."
  },
  {
    id: 2,
    duration: 5000,
    imagePrompt: "A fit pregnant woman doing prenatal yoga in a bright, modern studio, wearing athletic wear, peaceful expression, professional wellness photography, soft natural lighting, 16:9 aspect ratio",
    narration: "Get personalized workout plans tailored to your journey - from trying to conceive, through pregnancy, to postpartum recovery."
  },
  {
    id: 3,
    duration: 5000,
    imagePrompt: "A beautiful array of healthy, colorful meals and fresh ingredients arranged on a kitchen counter, nutritious food for moms, vibrant vegetables and proteins, professional food photography, 16:9 aspect ratio",
    narration: "Access nutritious meal plans and recipes designed specifically for moms."
  },
  {
    id: 4,
    duration: 5000,
    imagePrompt: "A diverse group of mothers of different ethnicities supporting each other in a warm, welcoming community space, smiling and connecting, professional lifestyle photography, warm lighting, 16:9 aspect ratio",
    narration: "Connect with a supportive community of moms who understand your journey."
  },
  {
    id: 5,
    duration: 5000,
    imagePrompt: "A modern smartphone displaying a friendly AI wellness coach chat interface with supportive messages, clean UI design, wellness app screenshot, professional tech photography, 16:9 aspect ratio",
    narration: "Chat with our AI wellness coach available 24/7 for personalized guidance and support."
  },
  {
    id: 6,
    duration: 5000,
    imagePrompt: "An inspiring call-to-action image with a confident, happy mother smiling at camera, empowered and healthy, professional portrait photography, soft purple and pink background, 16:9 aspect ratio",
    narration: "Start your wellness journey today with Catalyst Mom. Sign up now!"
  }
];
