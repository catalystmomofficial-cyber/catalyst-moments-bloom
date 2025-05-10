
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Clock, Dumbbell, Calendar, CheckCircle } from "lucide-react";

const WorkoutDetail = () => {
  const { slug } = useParams();
  
  // In a real app, you would fetch workout data based on the slug
  // For now we'll use mock data
  const workout = {
    id: "1",
    title: "Gentle Postpartum Core Recovery",
    description: "Safe, effective exercises to rebuild core strength after childbirth. This workout focuses on rebuilding your deep core muscles with gentle, progressive movements that respect your body's healing process.",
    duration: "15 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    category: "Postpartum",
    benefits: [
      "Safely rebuild core strength",
      "Improve posture and reduce back pain",
      "Prevent and heal diastasis recti",
      "Reestablish mind-body connection"
    ],
    exercises: [
      {
        name: "Diaphragmatic Breathing",
        duration: "2 min",
        image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110",
        description: "Focus on deep belly breathing to reconnect with your core."
      },
      {
        name: "Gentle Pelvic Tilts",
        duration: "3 min",
        image: "https://images.unsplash.com/photo-1616699002801-9046117diaab",
        description: "Subtle movements to activate lower abdominals and pelvic floor."
      },
      {
        name: "Modified Side Planks",
        duration: "4 min",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        description: "Controlled side support to engage obliques safely."
      },
      {
        name: "Heel Slides",
        duration: "3 min",
        image: "https://images.unsplash.com/photo-1517130038641-a774d04fc158",
        description: "Leg movements with core stabilization to build functional strength."
      },
      {
        name: "Gentle Bridge Lifts",
        duration: "3 min",
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5",
        description: "Controlled hip raises to strengthen posterior chain and core."
      }
    ]
  };

  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <AspectRatio ratio={21/9} className="bg-muted">
            <img 
              src={workout.image} 
              alt={workout.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </AspectRatio>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-catalyst-copper hover:bg-catalyst-copper">{workout.category}</Badge>
              <Badge variant="outline" className="bg-black/30 text-white border-white/20">{workout.level}</Badge>
              <Badge variant="outline" className="bg-black/30 text-white border-white/20">
                <Clock className="mr-1 h-3 w-3" /> {workout.duration}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{workout.title}</h1>
            <p className="text-white/80 max-w-3xl">{workout.description}</p>
          </div>
          <Button size="lg" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white text-black hover:bg-white/90 rounded-full w-16 h-16 flex items-center justify-center">
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="exercises" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="modifications">Modifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="exercises" className="space-y-6">
                {workout.exercises.map((exercise, index) => (
                  <Card key={exercise.name} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <AspectRatio ratio={4/3}>
                          <img 
                            src={exercise.image} 
                            alt={exercise.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </AspectRatio>
                      </div>
                      <CardContent className="flex-1 p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{exercise.name}</h3>
                          <Badge variant="outline">{exercise.duration}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{exercise.description}</p>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-catalyst-copper/10 text-catalyst-copper flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <Progress value={(index + 1) / workout.exercises.length * 100} className="h-2" />
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="instructions">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-4">How to Get the Most from This Workout</h3>
                    <ul className="space-y-3">
                      <li className="flex">
                        <CheckCircle className="h-5 w-5 text-catalyst-copper mr-2 flex-shrink-0 mt-0.5" />
                        <span>Move slowly and mindfully, focusing on proper form over speed</span>
                      </li>
                      <li className="flex">
                        <CheckCircle className="h-5 w-5 text-catalyst-copper mr-2 flex-shrink-0 mt-0.5" />
                        <span>Breathe deeply throughout each movement</span>
                      </li>
                      <li className="flex">
                        <CheckCircle className="h-5 w-5 text-catalyst-copper mr-2 flex-shrink-0 mt-0.5" />
                        <span>Stop if you feel any pain or discomfort</span>
                      </li>
                      <li className="flex">
                        <CheckCircle className="h-5 w-5 text-catalyst-copper mr-2 flex-shrink-0 mt-0.5" />
                        <span>Maintain neutral spine position throughout exercises</span>
                      </li>
                      <li className="flex">
                        <CheckCircle className="h-5 w-5 text-catalyst-copper mr-2 flex-shrink-0 mt-0.5" />
                        <span>Rest when needed - recovery is important</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="modifications">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-4">Workout Modifications</h3>
                    <p className="mb-4">This workout can be adapted to your current fitness level and recovery stage:</p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Early Postpartum (6-8 weeks)</h4>
                        <p className="text-muted-foreground">Focus on breathing exercises and gentle pelvic tilts only. Skip the bridge lifts and modify side planks to be very minimal.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Mid Recovery (3-6 months)</h4>
                        <p className="text-muted-foreground">Follow the standard routine as shown in the video.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Advanced Recovery (6+ months)</h4>
                        <p className="text-muted-foreground">Add small hand weights to bridge lifts and extend hold times for planks if you feel strong enough.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">Workout Benefits</h3>
                <ul className="space-y-3 mb-6">
                  {workout.benefits.map((benefit) => (
                    <li key={benefit} className="flex">
                      <CheckCircle className="h-5 w-5 text-catalyst-copper mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-catalyst-copper/10 flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-catalyst-copper" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{workout.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-catalyst-copper/10 flex items-center justify-center mr-3">
                      <Dumbbell className="h-5 w-5 text-catalyst-copper" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Difficulty</p>
                      <p className="font-medium">{workout.level}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-catalyst-copper/10 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-catalyst-copper" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recommended</p>
                      <p className="font-medium">2-3x per week</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-catalyst-copper hover:bg-catalyst-copper/90">
                  Start Workout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WorkoutDetail;
