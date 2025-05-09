
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { Activity, Baby, Calendar, Heart, Users } from "lucide-react";

const Index = () => {
  return (
    <PageLayout withPadding={false}>
      {/* Hero Section */}
      <section className="hero-gradient pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                Your Wellness <span className="gradient-text">Journey</span> Through Motherhood
              </h1>
              <p className="text-lg mb-8 text-muted-foreground max-w-lg">
                Catalyst Mom empowers you with personalized fitness, nutrition, self-care, and community support — designed for every stage of motherhood.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg" className="font-semibold px-8">
                  <Link to="/dashboard">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-64 h-64 bg-primary/10 rounded-full animate-pulse-soft"></div>
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="Mom with baby using laptop" 
                  className="relative z-10 rounded-lg shadow-lg max-w-sm md:max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything You Need in One Place</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've combined the essential wellness tools to support your motherhood journey, all personalized to your unique needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-primary" />}
              title="Adaptive Workouts"
              description="Workouts designed for pregnancy, postpartum, and busy mom life. All adjustable to your energy level and available time."
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8 text-primary" />}
              title="Wellness Tracking"
              description="Track your mood, sleep, and self-care practices with insights tailored to your motherhood stage."
            />
            <FeatureCard
              icon={<Baby className="h-8 w-8 text-primary" />}
              title="Stage-Based Support"
              description="Get resources specific to your journey, whether you're pregnant, postpartum, or years into motherhood."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-primary" />}
              title="Daily Guidance"
              description="Simple, achievable daily plans that flex with your unpredictable mom schedule."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Supportive Community"
              description="Connect with mothers in similar life stages who understand exactly what you're going through."
            />
            <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-lg p-6 flex flex-col items-center text-center shadow-sm card-hover">
              <div className="rounded-full bg-primary/20 p-3 mb-4">
                <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">+</div>
              </div>
              <h3 className="font-bold text-lg mb-2">And Much More</h3>
              <p className="text-muted-foreground mb-4">
                Nutrition guidance, expert advice, personalized plans, and tools that grow with you.
              </p>
              <Button variant="link" asChild className="mt-auto">
                <Link to="/features">Explore All Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Moms Like You Love Catalyst Mom</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our community about how Catalyst Mom has supported their wellness journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Finding time for fitness seemed impossible until I discovered Catalyst Mom. The 10-minute workouts fit perfectly into my chaotic schedule."
              name="Sarah T."
              role="Mom of 2, Postpartum"
            />
            <TestimonialCard
              quote="The pregnancy workouts helped me stay active safely. My delivery recovery was so much faster than with my first baby."
              name="Michelle K."
              role="Mom of 1, Pregnant"
              featured
            />
            <TestimonialCard
              quote="The community aspect of Catalyst Mom has been my lifeline. It's like having a village of supportive moms in my pocket."
              name="Jessica M."
              role="Mom of 3, Toddler Phase"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-catalyst-lightPurple to-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of moms who are prioritizing their well-being and finding balance in motherhood.
          </p>
          <Button asChild size="lg" className="font-semibold px-8">
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card className="border-0 shadow-sm card-hover">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          {icon}
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const TestimonialCard = ({ quote, name, role, featured = false }: { 
  quote: string, 
  name: string, 
  role: string, 
  featured?: boolean 
}) => {
  return (
    <Card className={`border-0 ${featured ? 'bg-primary/10' : 'bg-card'} shadow-sm card-hover`}>
      <CardContent className="p-6">
        <div className="mb-4">
          {"★".repeat(5)}
        </div>
        <p className="mb-4 italic">{`"${quote}"`}</p>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
