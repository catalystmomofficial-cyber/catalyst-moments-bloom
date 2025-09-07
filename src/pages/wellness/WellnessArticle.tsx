import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Headphones, ArrowLeft, Star, Clock, Users } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const WellnessArticle = () => {
  const { id } = useParams();

  const getArticleContent = (id: string) => {
    const articles = {
      '1': {
        title: 'Mindful Motherhood Meditation',
        type: 'audio',
        duration: '10-20 min',
        rating: 4.8,
        users: 1240,
        icon: <Headphones className="w-5 h-5" />,
        badge: 'Popular',
        content: `
          <h2>Introduction to Mindful Motherhood</h2>
          <p>Mindful motherhood meditation is a powerful practice designed specifically for mothers at every stage of their journey. Whether you're trying to conceive, pregnant, or navigating the challenges of raising children, these guided meditations offer a sanctuary of calm in the beautiful chaos of motherhood.</p>
          
          <h3>What You'll Learn</h3>
          <ul>
            <li>Breathing techniques for stress relief during overwhelming moments</li>
            <li>Body scan meditations for pregnancy and postpartum recovery</li>
            <li>Loving-kindness practices for self-compassion</li>
            <li>Quick 5-minute meditations for busy schedules</li>
            <li>Sleep meditations for better rest</li>
          </ul>
          
          <h3>Benefits for Mothers</h3>
          <p>Regular meditation practice has been shown to:</p>
          <ul>
            <li>Reduce stress and anxiety levels</li>
            <li>Improve emotional regulation</li>
            <li>Enhance sleep quality</li>
            <li>Increase patience and presence with children</li>
            <li>Support overall mental health and wellbeing</li>
          </ul>
          
          <h3>Getting Started</h3>
          <p>Begin with just 5 minutes a day. Find a quiet space where you won't be interrupted - even if it's in your car during nap time or in the bathroom for a few precious moments of solitude. Remember, there's no "perfect" way to meditate as a mother. Some days you might be interrupted by crying babies or curious toddlers, and that's okay. The practice is about returning to the present moment, again and again.</p>
          
          <h3>Recommended Sessions</h3>
          <ol>
            <li><strong>Morning Grounding (10 min):</strong> Start your day with intention and calm</li>
            <li><strong>Midday Reset (5 min):</strong> Quick stress relief during busy moments</li>
            <li><strong>Evening Gratitude (15 min):</strong> Reflect on the day with appreciation</li>
            <li><strong>Sleep Preparation (20 min):</strong> Gentle guidance for restful sleep</li>
          </ol>
          
          <p>Remember, you are doing an incredible job. Take these moments to honor yourself and the beautiful work you're doing as a mother.</p>
        `
      },
      '2': {
        title: 'Self-Care Essentials Guide',
        type: 'ebook',
        duration: '45 min read',
        rating: 4.9,
        users: 890,
        icon: <BookOpen className="w-5 h-5" />,
        badge: 'Featured',
        content: `
          <h2>The Mother's Guide to Sustainable Self-Care</h2>
          <p>Self-care isn't selfish—it's essential. This comprehensive guide will help you build sustainable self-care habits that fit into your busy life as a mother, ensuring you can pour from a full cup rather than running on empty.</p>
          
          <h3>Understanding True Self-Care</h3>
          <p>Self-care goes beyond bubble baths and spa days (though those are wonderful too!). It's about creating systems and practices that support your physical, emotional, mental, and spiritual wellbeing consistently.</p>
          
          <h3>The Four Pillars of Mother's Self-Care</h3>
          
          <h4>1. Physical Self-Care</h4>
          <ul>
            <li>Prioritizing sleep (even if it's in small chunks)</li>
            <li>Nourishing your body with wholesome foods</li>
            <li>Moving your body in ways that feel good</li>
            <li>Staying hydrated throughout the day</li>
            <li>Regular medical check-ups</li>
          </ul>
          
          <h4>2. Emotional Self-Care</h4>
          <ul>
            <li>Acknowledging and validating your feelings</li>
            <li>Setting healthy boundaries</li>
            <li>Connecting with supportive friends and family</li>
            <li>Practicing self-compassion</li>
            <li>Seeking professional support when needed</li>
          </ul>
          
          <h4>3. Mental Self-Care</h4>
          <ul>
            <li>Engaging in activities that stimulate your mind</li>
            <li>Learning new skills or pursuing interests</li>
            <li>Practicing mindfulness and meditation</li>
            <li>Limiting negative media consumption</li>
            <li>Journaling for clarity and processing</li>
          </ul>
          
          <h4>4. Spiritual Self-Care</h4>
          <ul>
            <li>Connecting with your values and purpose</li>
            <li>Spending time in nature</li>
            <li>Practicing gratitude</li>
            <li>Engaging in spiritual or religious practices</li>
            <li>Creating meaningful rituals</li>
          </ul>
          
          <h3>Micro Self-Care: Big Impact in Small Moments</h3>
          <p>When time is limited, these quick practices can make a significant difference:</p>
          <ul>
            <li>5 deep breaths before getting out of bed</li>
            <li>Drinking tea mindfully while it's still hot</li>
            <li>Stepping outside for fresh air</li>
            <li>Stretching during naptime</li>
            <li>Listening to one favorite song</li>
            <li>Writing down three things you're grateful for</li>
          </ul>
          
          <h3>Creating Your Personal Self-Care Plan</h3>
          <p>Use this framework to design a self-care routine that works for your unique situation:</p>
          <ol>
            <li><strong>Assess:</strong> What areas of self-care need the most attention?</li>
            <li><strong>Plan:</strong> Choose 2-3 practices you can realistically commit to</li>
            <li><strong>Schedule:</strong> Block time in your calendar (even 10 minutes counts!)</li>
            <li><strong>Start Small:</strong> Begin with the easiest practice to build momentum</li>
            <li><strong>Adjust:</strong> Modify your plan as your life and needs change</li>
          </ol>
          
          <h3>Overcoming Common Self-Care Obstacles</h3>
          <p><strong>"I don't have time":</strong> Start with 5 minutes. Self-care doesn't require large blocks of time.</p>
          <p><strong>"I feel guilty":</strong> Remember that taking care of yourself allows you to better care for others.</p>
          <p><strong>"It feels selfish":</strong> Self-care is an investment in your family's wellbeing too.</p>
          <p><strong>"I don't know where to start":</strong> Begin with the basics—sleep, nutrition, and hydration.</p>
          
          <p>Remember, you deserve care and attention just as much as everyone else in your life. Start where you are, use what you have, and do what you can.</p>
        `
      },
      '3': {
        title: 'Quick Stress Relief Techniques',
        type: 'video',
        duration: '5-15 min',
        rating: 4.7,
        users: 2100,
        icon: <Video className="w-5 h-5" />,
        badge: 'Quick Win',
        content: `
          <h2>Instant Stress Relief for Busy Mothers</h2>
          <p>When stress hits and you need immediate relief, these quick techniques can help you reset and find your center in just minutes. Perfect for those overwhelming moments when you need calm, fast.</p>
          
          <h3>The 4-7-8 Breathing Technique</h3>
          <p>This powerful breathing exercise can calm your nervous system in under a minute:</p>
          <ol>
            <li>Exhale completely through your mouth</li>
            <li>Inhale through your nose for 4 counts</li>
            <li>Hold your breath for 7 counts</li>
            <li>Exhale through your mouth for 8 counts</li>
            <li>Repeat 3-4 times</li>
          </ol>
          
          <h3>Progressive Muscle Relaxation (5-Minute Version)</h3>
          <p>Perfect for when you have a few minutes to fully reset:</p>
          <ol>
            <li>Sit or lie down comfortably</li>
            <li>Tense your feet for 5 seconds, then relax</li>
            <li>Move up to your calves, thighs, abdomen, hands, arms, shoulders, and face</li>
            <li>Tense each muscle group for 5 seconds, then release</li>
            <li>Notice the contrast between tension and relaxation</li>
          </ol>
          
          <h3>The 5-4-3-2-1 Grounding Technique</h3>
          <p>Use your senses to bring yourself back to the present moment:</p>
          <ul>
            <li><strong>5 things you can see:</strong> Look around and name them</li>
            <li><strong>4 things you can touch:</strong> Feel different textures</li>
            <li><strong>3 things you can hear:</strong> Notice sounds around you</li>
            <li><strong>2 things you can smell:</strong> Take a deep breath</li>
            <li><strong>1 thing you can taste:</strong> Maybe sip some water or tea</li>
          </ul>
          
          <h3>Quick Physical Releases</h3>
          <p>Sometimes stress gets stuck in our bodies. Try these:</p>
          <ul>
            <li><strong>Shoulder Rolls:</strong> 10 backwards, 10 forwards</li>
            <li><strong>Neck Stretches:</strong> Gently side to side, up and down</li>
            <li><strong>Gentle Twists:</strong> Sitting or standing, rotate your spine</li>
            <li><strong>Shake It Out:</strong> Literally shake your hands, feet, whole body</li>
            <li><strong>Power Pose:</strong> Stand tall with hands on hips for 2 minutes</li>
          </ul>
          
          <h3>Mental Reset Techniques</h3>
          
          <h4>The STOP Method</h4>
          <ul>
            <li><strong>S</strong>top what you're doing</li>
            <li><strong>T</strong>ake a breath</li>
            <li><strong>O</strong>bserve your thoughts and feelings</li>
            <li><strong>P</strong>roceed with intention</li>
          </ul>
          
          <h4>Quick Gratitude Practice</h4>
          <p>Think of three specific things you're grateful for right now. Be detailed—instead of "my kids," try "the way my daughter hugged me this morning" or "my son's silly laugh during dinner."</p>
          
          <h3>Emergency Stress Kit</h3>
          <p>Keep these items accessible for quick stress relief:</p>
          <ul>
            <li>A favorite essential oil to smell</li>
            <li>A photo that makes you smile</li>
            <li>A playlist of calming songs</li>
            <li>A stress ball or fidget toy</li>
            <li>Gum or mints for a sensory reset</li>
          </ul>
          
          <h3>Creating Stress-Prevention Habits</h3>
          <p>The best stress relief is prevention. Build these into your routine:</p>
          <ul>
            <li>Start each day with 5 minutes of quiet time</li>
            <li>Use transitions (like red lights) as mindfulness cues</li>
            <li>Take three deep breaths before entering your home</li>
            <li>Set a hourly reminder to check in with yourself</li>
            <li>Create a bedtime routine that signals relaxation</li>
          </ul>
          
          <p>Remember, stress is a normal part of life, especially motherhood. These tools aren't about eliminating stress entirely, but about building your resilience and ability to bounce back quickly. Practice these techniques when you're calm so they're readily available when you need them most.</p>
        `
      }
    };

    return articles[id as keyof typeof articles] || null;
  };

  const article = getArticleContent(id || '');

  if (!article) {
    return <Navigate to="/wellness/resources" replace />;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'ebook': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'Featured': return 'default';
      case 'Popular': return 'secondary';
      case 'Quick Win': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resources
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {article.icon}
                  <Badge className={getTypeColor(article.type)}>
                    {article.type}
                  </Badge>
                </div>
                <Badge variant={getBadgeVariant(article.badge)}>
                  {article.badge}
                </Badge>
              </div>
              
              <CardTitle className="text-2xl mb-4">{article.title}</CardTitle>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {article.users.toLocaleString()} users
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{article.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Found this resource helpful? Share it with other moms in your network!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default WellnessArticle;