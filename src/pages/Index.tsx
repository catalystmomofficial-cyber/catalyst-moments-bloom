
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import PageLayout from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { Activity, Baby, Calendar, Heart, Users, ArrowRight, Play, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <PageLayout withPadding={false}>
      {/* Hero Section */}
      <section className="hero-gradient pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/30 text-primary">
                Made for Every Stage of Motherhood
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
                Your Wellness <span className="text-catalyst-copper">Journey</span> Through Motherhood
              </h1>
              <p className="text-lg mb-8 text-muted-foreground max-w-lg leading-relaxed">
                Catalyst Mom empowers you with personalized fitness, nutrition, self-care, and community support — designed for every stage of motherhood.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg" className="font-medium rounded-full px-8 bg-catalyst-copper hover:bg-catalyst-copper/90">
                  <Link to="/dashboard">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-catalyst-copper/20 text-catalyst-copper hover:bg-catalyst-copper/5">
                  <Link to="/about" className="flex items-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-64 h-64 bg-catalyst-copper/10 rounded-full animate-pulse-soft"></div>
                <div className="absolute bottom-8 -right-8 w-40 h-40 bg-catalyst-copper/10 rounded-full animate-float"></div>
                <div className="relative z-10 rounded-2xl shadow-soft overflow-hidden max-w-sm md:max-w-md mx-auto">
                  <AspectRatio ratio={4/5} className="bg-muted">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                      alt="Mom with baby using laptop" 
                      className="object-cover h-full w-full"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                    <Button size="icon" className="rounded-full bg-white/90 hover:bg-white text-catalyst-copper">
                      <Play className="h-5 w-5 ml-0.5" />
                    </Button>
                    <span className="text-white text-sm font-medium drop-shadow-md">Watch Story</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container container-padding mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Place</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've combined the essential wellness tools to support your motherhood journey, all personalized to your unique needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-catalyst-copper" />}
              title="Adaptive Workouts"
              description="Workouts designed for pregnancy, postpartum, and busy mom life. All adjustable to your energy level and available time."
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8 text-catalyst-copper" />}
              title="Wellness Tracking"
              description="Track your mood, sleep, and self-care practices with insights tailored to your motherhood stage."
            />
            <FeatureCard
              icon={<Baby className="h-8 w-8 text-catalyst-copper" />}
              title="Stage-Based Support"
              description="Get resources specific to your journey, whether you're pregnant, postpartum, or years into motherhood."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-catalyst-copper" />}
              title="Daily Guidance"
              description="Simple, achievable daily plans that flex with your unpredictable mom schedule."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-catalyst-copper" />}
              title="Supportive Community"
              description="Connect with mothers in similar life stages who understand exactly what you're going through."
            />
            <div className="bg-gradient-to-br from-catalyst-copper/5 to-catalyst-peach/20 rounded-2xl p-7 flex flex-col items-center text-center shadow-soft">
              <div className="rounded-full bg-catalyst-copper/10 p-3 mb-4">
                <div className="bg-catalyst-copper rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">+</div>
              </div>
              <h3 className="font-bold text-lg mb-2">And Much More</h3>
              <p className="text-muted-foreground mb-6">
                Nutrition guidance, expert advice, personalized plans, and tools that grow with you.
              </p>
              <Button variant="ghost" asChild className="mt-auto text-catalyst-copper hover:text-catalyst-copper/90 hover:bg-catalyst-copper/5">
                <Link to="/features" className="flex items-center">
                  Explore All Features <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="section-padding bg-muted/30">
        <div className="container container-padding mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed With You in Mind</h2>
              <p className="text-muted-foreground mb-8">
                At Catalyst Mom, we understand the unique challenges of motherhood because we've been there. Our platform is built by moms, for moms.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-catalyst-copper mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Expert-Backed Content</h4>
                    <p className="text-sm text-muted-foreground">All programs developed by certified pre/postnatal specialists</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-catalyst-copper mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Flexible & Adaptable</h4>
                    <p className="text-sm text-muted-foreground">Workouts and programs that adjust to your changing needs and time constraints</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-catalyst-copper mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Holistic Approach</h4>
                    <p className="text-sm text-muted-foreground">We address physical, mental and emotional wellbeing together</p>
                  </div>
                </div>
              </div>
              
              <Button asChild className="mt-8 bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/about">Learn Our Story</Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute -z-10 top-10 -left-10 w-64 h-64 bg-catalyst-copper/5 rounded-full"></div>
              <div className="absolute -z-10 bottom-10 -right-10 w-48 h-48 bg-catalyst-peach/20 rounded-full"></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden shadow-soft">
                    <AspectRatio ratio={1/1}>
                      <img 
                        src="https://images.unsplash.com/photo-1518310952931-b1de897abd5e"
                        alt="Mother and baby"
                        className="object-cover h-full w-full"
                      />
                    </AspectRatio>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-soft translate-x-6">
                    <AspectRatio ratio={4/5}>
                      <img 
                        src="https://images.unsplash.com/photo-1561989776-9d6fb5f782ed"
                        alt="Mother doing yoga"
                        className="object-cover h-full w-full"
                      />
                    </AspectRatio>
                  </div>
                </div>
                <div className="space-y-4 translate-y-10">
                  <div className="rounded-xl overflow-hidden shadow-soft">
                    <AspectRatio ratio={4/5}>
                      <img 
                        src="https://images.unsplash.com/photo-1567427359966-87be53a3f3db"
                        alt="Pregnant woman stretching"
                        className="object-cover h-full w-full"
                      />
                    </AspectRatio>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-soft">
                    <AspectRatio ratio={1/1}>
                      <img 
                        src="https://images.unsplash.com/photo-1562538930-05d47b114bab"
                        alt="Family outdoors"
                        className="object-cover h-full w-full"
                      />
                    </AspectRatio>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="section-padding bg-white">
        <div className="container container-padding mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Moms Love Catalyst Mom</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our community about how Catalyst Mom has supported their wellness journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Finding time for fitness seemed impossible until I discovered Catalyst Mom. The 10-minute workouts fit perfectly into my chaotic schedule."
              name="Sarah T."
              role="Mom of 2, Postpartum"
              image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91"
            />
            <TestimonialCard
              quote="The pregnancy workouts helped me stay active safely. My delivery recovery was so much faster than with my first baby."
              name="Michelle K."
              role="Mom of 1, Pregnant"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
              featured
            />
            <TestimonialCard
              quote="The community aspect of Catalyst Mom has been my lifeline. It's like having a village of supportive moms in my pocket."
              name="Jessica M."
              role="Mom of 3, Toddler Phase"
              image="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-catalyst-copper/10 to-white">
        <div className="container container-padding mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-3 py-1 border-primary/30 text-primary">
            Join Us Today
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of moms who are prioritizing their well-being and finding balance in motherhood.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="font-medium rounded-full px-8 bg-catalyst-copper hover:bg-catalyst-copper/90">
              <Link to="/dashboard">Get Started Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-catalyst-copper/20 text-catalyst-copper hover:bg-catalyst-copper/5">
              <Link to="/about">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card className="border-0 shadow-soft rounded-2xl overflow-hidden card-hover">
      <CardContent className="p-7 flex flex-col items-center text-center">
        <div className="rounded-full bg-catalyst-copper/10 p-3 mb-4">
          {icon}
        </div>
        <h3 className="font-bold text-lg mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const TestimonialCard = ({ 
  quote, 
  name, 
  role, 
  image,
  featured = false 
}: { 
  quote: string, 
  name: string, 
  role: string, 
  image: string,
  featured?: boolean 
}) => {
  return (
    <Card 
      className={cn(
        "border-0 shadow-soft overflow-hidden card-hover rounded-2xl", 
        featured ? "bg-catalyst-copper/5" : "bg-card"
      )}
    >
      <CardContent className="p-7">
        <div className="mb-5 flex">
          {"★".repeat(5).split("").map((star, i) => (
            <span key={i} className="text-catalyst-copper">★</span>
          ))}
        </div>
        <p className="mb-6 text-foreground/90 italic leading-relaxed">{`"${quote}"`}</p>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-catalyst-copper/20">
            <img src={image} alt={name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
