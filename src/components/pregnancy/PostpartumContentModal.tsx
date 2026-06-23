import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Baby, Utensils, Home, CheckCircle, BookOpen, Play, FileText, MessageCircle } from 'lucide-react';

interface ContentModule {
  id: string;
  type: 'lesson' | 'checklist' | 'video' | 'reflection';
  title: string;
  content: string;
  completed: boolean;
  duration?: string;
}

interface PostpartumContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: {
    id: string;
    category: string;
    title: string;
    description: string;
  } | null;
  onComplete: (topicId: string) => void;
}

const contentModules: Record<string, ContentModule[]> = {
  '1': [ // Physical Healing
    {
      id: '1-1',
      type: 'lesson',
      title: 'Your Body After Birth: What to Expect',
      content: `**Week 1-2: The immediate postpartum period**

Your body has done something incredible, and now it needs time to heal. Here's what's completely normal:

**Bleeding (Lochia):** You'll have bleeding for 2-6 weeks. It starts heavy and red, then becomes lighter and brown/yellow.

**Perineal Care:** Whether you had a vaginal birth or C-section, gentle care is key:
- Use a peri bottle with warm water after using the bathroom
- Pat dry, don't wipe
- Ice packs can reduce swelling
- Witch hazel pads provide soothing relief

**Breast Changes:** Whether breastfeeding or not, your breasts will change:
- Engorgement is normal around day 3-5
- Nipples may be sore initially
- Proper latching helps prevent pain

**Energy Levels:** You'll feel exhausted. This isn't weakness - it's recovery. Rest when baby rests isn't just advice, it's medicine.

**Red Flags - Call your doctor immediately:**
- Heavy bleeding (soaking a pad every hour)
- Fever over 100.4°F
- Severe abdominal pain
- Signs of infection (foul odor, increasing pain)`,
      completed: false,
      duration: '5 min read'
    },
    {
      id: '1-2',
      type: 'checklist',
      title: 'Recovery Essentials Kit',
      content: `**Your Postpartum Recovery Toolkit:**

□ Peri bottles (2-3 for different bathrooms)
□ Witch hazel pads
□ Ice packs or ice diapers
□ Comfortable, disposable underwear
□ Heavy-flow pads
□ Stool softener (ask your doctor)
□ Nipple cream (if breastfeeding)
□ Comfortable nursing bras
□ Water bottle with straw
□ Snacks within arm's reach
□ Phone charger for bedside

**For C-Section Recovery:**
□ Belly band/binder
□ Button-up shirts
□ Pillows for car rides
□ Step stool for getting in/out of bed`,
      completed: false
    },
    {
      id: '1-3',
      type: 'reflection',
      title: 'Healing Mindset Check-in',
      content: `**Take a moment to reflect:**

Your body just performed a miracle. It grew and delivered your baby. Now it deserves the same love and patience you'd give your best friend.

**Journal Prompts:**
- How am I feeling about my body today?
- What does my body need right now?
- How can I show myself compassion during recovery?
- What healing affirmations resonate with me?

**Gentle Reminders:**
- Healing isn't linear
- Every woman's recovery timeline is different
- Asking for help is strength, not weakness
- You're not "bouncing back" - you're moving forward

Write down one kind thing you can do for your body today.`,
      completed: false,
      duration: '10 min reflection'
    }
  ],
  '2': [ // Baby Blues vs PPD
    {
      id: '2-1',
      type: 'lesson',
      title: 'Understanding Postpartum Mental Health',
      content: `**Baby Blues vs. Postpartum Depression: Know the Difference**

**Baby Blues (80% of new moms experience this):**
- Mood swings and crying spells
- Anxiety and irritability
- Feeling overwhelmed
- Difficulty sleeping
- Starts within first few days after birth
- Usually resolves within 2 weeks

**Postpartum Depression (10-20% of new moms):**
- Severe mood swings
- Excessive crying
- Difficulty bonding with baby
- Withdrawing from family and friends
- Loss of appetite or overeating
- Inability to sleep or sleeping too much
- Intense irritability and anger
- Feelings of shame, guilt, or inadequacy
- Severe anxiety and panic attacks
- Thoughts of harming yourself or baby

**Postpartum Anxiety:**
- Constant worry about baby's health/safety
- Racing thoughts
- Physical symptoms (rapid heartbeat, nausea)
- Avoidance of situations due to worry

**When to Seek Help:**
- Symptoms last longer than 2 weeks
- Symptoms interfere with daily life
- You have thoughts of self-harm
- You're unable to care for yourself or baby

Remember: This is NOT your fault. These are medical conditions that can be treated.`,
      completed: false,
      duration: '7 min read'
    },
    {
      id: '2-2',
      type: 'checklist',
      title: 'Building Your Mental Health Support Plan',
      content: `**Create Your Safety Net:**

□ Find a postpartum-informed therapist
□ Talk to your OB/midwife about mental health screening
□ Identify trusted friends/family to check in regularly
□ Download a mental health app (Postpartum Support International has great resources)
□ Join a new mom support group (online or in-person)
□ Learn about your insurance coverage for mental health
□ Save crisis hotlines in your phone

**Daily Mental Health Toolkit:**
□ 5-minute morning affirmations
□ One text to a supportive person
□ 10 minutes outside (if possible)
□ One thing you're grateful for
□ One kind thing you did for yourself

**Crisis Resources:**
- Postpartum Support International: 1-800-944-4773
- Crisis Text Line: Text HOME to 741741
- National Suicide Prevention Lifeline: 988`,
      completed: false
    }
  ],
  '3': [ // Postpartum Meal Planning
    {
      id: '3-1',
      type: 'lesson',
      title: 'Nourishing Your Postpartum Body',
      content: `**Eating for Recovery and Energy**

Your body needs extra nutrition to heal, especially if breastfeeding. Focus on:

**Protein (25-30g per meal):**
- Supports tissue repair
- Keeps you fuller longer
- Examples: eggs, Greek yogurt, lean meats, beans, nuts

**Iron-Rich Foods:**
- Replenish stores after blood loss
- Examples: spinach, lean beef, lentils, fortified cereals

**Healthy Fats:**
- Support hormone production and brain health
- Examples: avocado, nuts, olive oil, fatty fish

**Fiber:**
- Helps with postpartum constipation
- Examples: fruits, vegetables, whole grains, beans

**Hydration:**
- Aim for 10-12 cups of water daily
- More if breastfeeding
- Add lemon, cucumber, or mint for variety

**Foods That Support Milk Production (if breastfeeding):**
- Oats
- Fennel
- Fenugreek
- Dark leafy greens
- Almonds`,
      completed: false,
      duration: '6 min read'
    },
    {
      id: '3-2',
      type: 'checklist',
      title: 'Meal Prep Made Simple',
      content: `**Freezer Meal Ideas (prep during pregnancy):**

□ Slow cooker chicken and vegetables
□ Lasagna portions
□ Breakfast burritos
□ Soup portions
□ Muffins (lactation muffins if breastfeeding)
□ Energy balls/bars

**One-Handed Snacks:**
□ Trail mix
□ Granola bars
□ Apples with peanut butter packets
□ Greek yogurt cups
□ Hard-boiled eggs
□ Cheese sticks

**Meal Train Organization:**
□ Set up a meal train with friends/family
□ Include paper plates and utensils requests
□ Ask for freezer-friendly options
□ Request easy-to-reheat meals
□ Don't forget about breakfast and lunch!

**Quick Meal Ideas:**
□ Smoothie bowls (make packs ahead)
□ Avocado toast with egg
□ Greek yogurt parfait
□ Rotisserie chicken salads`,
      completed: false
    }
  ]
};

export const PostpartumContentModal = ({ isOpen, onClose, topic, onComplete }: PostpartumContentModalProps) => {
  const [activeModule, setActiveModule] = useState(0);
  const [moduleProgress, setModuleProgress] = useState<Record<string, boolean>>({});

  if (!topic) return null;

  const modules = contentModules[topic.id] || [];
  const completedModules = Object.values(moduleProgress).filter(Boolean).length;
  const progressPercentage = modules.length > 0 ? (completedModules / modules.length) * 100 : 0;

  const handleModuleComplete = (moduleId: string) => {
    setModuleProgress(prev => ({ ...prev, [moduleId]: true }));
  };

  const handleTopicComplete = () => {
    if (progressPercentage === 100) {
      onComplete(topic.id);
      onClose();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recovery': return <Heart className="h-4 w-4" />;
      case 'mental': return <Brain className="h-4 w-4" />;
      case 'baby': return <Baby className="h-4 w-4" />;
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'home': return <Home className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'checklist': return <CheckCircle className="h-4 w-4" />;
      case 'reflection': return <MessageCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getCategoryIcon(topic.category)}
            {topic.title}
          </DialogTitle>
          <DialogDescription>
            {topic.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
              <CardDescription>
                Complete all modules to mark this topic as done
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Modules completed</span>
                  <span>{completedModules} of {modules.length}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Module Navigation */}
          <Tabs value={activeModule.toString()} onValueChange={(value) => setActiveModule(parseInt(value))}>
            <TabsList className="grid w-full grid-cols-3">
              {modules.map((module, index) => (
                <TabsTrigger key={module.id} value={index.toString()} className="flex items-center gap-2">
                  {getModuleIcon(module.type)}
                  <span className="hidden sm:inline">{module.title.split(':')[0]}</span>
                  {moduleProgress[module.id] && <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />}
                </TabsTrigger>
              ))}
            </TabsList>

            {modules.map((module, index) => (
              <TabsContent key={module.id} value={index.toString()}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getModuleIcon(module.type)}
                        {module.title}
                      </div>
                      {module.duration && (
                        <span className="text-sm text-muted-foreground">{module.duration}</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      {module.content.split('\n').map((paragraph, idx) => {
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                          return <h4 key={idx} className="font-semibold mt-4 mb-2">{paragraph.slice(2, -2)}</h4>;
                        }
                        if (paragraph.startsWith('□')) {
                          return (
                            <div key={idx} className="flex items-center gap-2 my-1">
                              <Checkbox />
                              <span className="text-sm">{paragraph.slice(2)}</span>
                            </div>
                          );
                        }
                        if (paragraph.startsWith('-')) {
                          return <li key={idx} className="ml-4 text-sm">{paragraph.slice(2)}</li>;
                        }
                        if (paragraph.trim()) {
                          return <p key={idx} className="text-sm leading-relaxed">{paragraph}</p>;
                        }
                        return <br key={idx} />;
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
                        disabled={activeModule === 0}
                      >
                        Previous
                      </Button>

                      <div className="space-x-2">
                        {!moduleProgress[module.id] && (
                          <Button
                            onClick={() => handleModuleComplete(module.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Complete
                          </Button>
                        )}
                        
                        {activeModule < modules.length - 1 ? (
                          <Button
                            onClick={() => setActiveModule(activeModule + 1)}
                          >
                            Next Module
                          </Button>
                        ) : (
                          progressPercentage === 100 && (
                            <Button
                              onClick={handleTopicComplete}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Complete Topic
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};