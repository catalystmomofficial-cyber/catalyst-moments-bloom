import { Exercise } from './types';

// Construct Supabase storage URL for videos
const getVideoUrl = (week: number, day: number): string | null => {
  // Week 1 uses full day names, Week 2+ uses lowercase abbreviations
  const dayNamesFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayNamesLowercase = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  
  const dayNames = week === 1 ? dayNamesFull : dayNamesLowercase;
  const dayName = dayNames[day - 1]; // Convert day number to correct format day name
  
  if (!dayName) {
    console.warn('Invalid day number:', day);
    return null;
  }
  
  // Week 1 uses "Week X", Week 2 uses "Week X", Week 3+ uses "week X" (lowercase)
  const weekPrefix = week <= 2 ? 'Week' : 'week';
  
  // Week 4 has special folder naming (no space)
  const folderName = week === 4 ? `week${week}` : `week%20${week}`;
  
  const url = `https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/30%20days%20glow%20up/${folderName}/${weekPrefix}%20${week}%20-%20${dayName}.mp4`;
  console.log('Constructed video URL:', url);
  return url;
};

// Generate workout data for any week and day combination
export const getWorkoutData = (week: number, day: number): Exercise[] => {
  console.log('Getting workout data for week:', week, 'day:', day);
  
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayName = dayNames[day - 1];
  
  const weekTitles = {
    1: 'Foundation',
    2: 'Strength', 
    3: 'Energy',
    4: 'Glow'
  };
  
  const weekTitle = weekTitles[week as keyof typeof weekTitles] || 'Workout';
  
  const workoutData: Exercise[] = [
    {
      id: "main-workout",
      name: `${dayName} ${weekTitle}`,
      duration: 1200, // 20 minutes default
      description: `Week ${week} Day ${day} - ${dayName} workout`,
      videoUrl: getVideoUrl(week, day) || undefined,
      instructions: [
        `Follow the Week ${week} ${dayName} workout video`,
        "Focus on proper form and technique",
        "Listen to your body and modify as needed",
        "Take breaks when necessary",
        "Stay hydrated throughout the workout"
      ],
      completed: false
    }
  ];

  // Special cases for Week 1 with more detailed structure
  if (week === 1) {
    switch (day) {
      case 1: // Monday
        return [
          {
            id: "warm-up",
            name: "Gentle Warm-up",
            duration: 300, // 5 minutes
            description: "Start your journey with gentle movements",
            videoUrl: getVideoUrl(week, day) || undefined,
            instructions: [
              "Begin with deep breathing exercises",
              "Gentle neck and shoulder rolls", 
              "Light arm circles",
              "Pelvic tilts"
            ],
            completed: false
          },
          {
            id: "main-workout",
            name: "Foundation Workout",
            duration: 900, // 15 minutes
            description: "Building your fitness foundation",
            videoUrl: getVideoUrl(week, day) || undefined,
            instructions: [
              "Follow along with the video",
              "Focus on proper form",
              "Listen to your body",
              "Take breaks as needed"
            ],
            completed: false
          },
          {
            id: "cool-down",
            name: "Cool Down & Stretch",
            duration: 300, // 5 minutes
            description: "End with calming stretches",
            videoUrl: getVideoUrl(week, day) || undefined,
            instructions: [
              "Gentle stretching sequence",
              "Deep breathing exercises",
              "Relaxation and recovery"
            ],
            completed: false
          }
        ];
      case 5: // Friday
        return [
          {
            id: "main-workout",
            name: "Friday Finish Strong",
            duration: 1500, // 25 minutes
            description: "End the week with energy",
            videoUrl: getVideoUrl(week, day) || undefined,
            instructions: [
              "Follow the Friday workout video",
              "Give your best effort",
              "Celebrate the week's progress",
              "Push through but listen to your body"
            ],
            completed: false
          }
        ];
    }
  }
  
  console.log('Returning workout data:', workoutData);
  return workoutData;
};