
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import CookieConsentBanner from "./components/common/CookieConsentBanner";
import GlobalVideoPlayer from "./components/video/GlobalVideoPlayer";
import { GoogleAuthOnboarding } from "./components/onboarding/GoogleAuthOnboarding";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { VideoPlayerProvider } from "@/contexts/VideoPlayerContext";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/WorkoutDetail";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Wellness from "./pages/Wellness";
import Community from "./pages/Community";
import GroupDetail from "./pages/GroupDetail";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CheckoutModal from "./components/subscription/CheckoutModal";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/auth/PrivateRoute";
import SubscriptionGuard from "./components/auth/SubscriptionGuard";
import SubscriptionRefresher from "./components/auth/SubscriptionRefresher";
import FoodCalorieChecker from "./pages/FoodCalorieChecker";
import Questionnaire from "./pages/Questionnaire";
import MealPlan from "./pages/MealPlan";
import MealPlanDetail from "./pages/MealPlanDetail";
import WorkoutPlan from "./pages/WorkoutPlan";
import SavedWorkoutPlans from "./pages/SavedWorkoutPlans";
import WorkoutPlanDetail from "./pages/WorkoutPlanDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Experts from "./pages/Experts";
import Research from "./pages/Research";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import GlowAndGo from "./pages/GlowAndGo";
import Affiliate from "./pages/Affiliate";
import Admin from "./pages/Admin";
import BlogPreview from "./pages/BlogPreview";
import SelfCareGuide from "./pages/wellness/SelfCareGuide";
import WellnessResources from "./pages/wellness/WellnessResources";
import WellnessArticle from "./pages/wellness/WellnessArticle";
import Progress from "./pages/Progress";
import BirthBallGuide from "./pages/BirthBallGuide";
import BirthBallTrimester from "./pages/BirthBallTrimester";
import BirthBallExercise from "./pages/BirthBallExercise";
import BirthBallBuyingGuide from "./pages/BirthBallBuyingGuide";
import BirthBallSafety from "./pages/BirthBallSafety";
import BirthBallFAQ from "./pages/BirthBallFAQ";
import BirthBallEducation from "./pages/BirthBallEducation";
import BirthBallEarlyLabor from "./pages/BirthBallEarlyLabor";
import SavedBirthBallExercises from "./pages/SavedBirthBallExercises";
import AssessmentResults from "./pages/AssessmentResults";
import BirthBallCommunityFeed from "./pages/BirthBallCommunityFeed";
import BirthBallBreathingPractice from "./pages/BirthBallBreathingPractice";
import CreditPurchaseSuccess from "./pages/CreditPurchaseSuccess";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import About from "./pages/About";
import Unsubscribe from "./pages/Unsubscribe";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Create a client
const queryClient = new QueryClient();

function AppContent() {
  const { showCheckoutModal, setShowCheckoutModal } = useAuth();
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Helmet>
          <title>Catalyst Mom | Wellness, Fitness & Nutrition</title>
          <meta name="description" content="Personalized wellness, fitness, and nutrition for moms. Join our community for workouts, meal plans, and support." />
          <link rel="canonical" href={window.location.href} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Catalyst Mom | Wellness, Fitness & Nutrition" />
          <meta property="og:description" content="Personalized wellness, fitness, and nutrition for moms." />
          <meta property="og:url" content={window.location.href} />
        </Helmet>
        <ScrollToTop />
        <SubscriptionRefresher />
        <GoogleAuthOnboarding />
        <Toaster />
        <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/food-calories" element={<FoodCalorieChecker />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/blog/preview/:id" element={<PrivateRoute><BlogPreview /></PrivateRoute>} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/research" element={<Research />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        
        {/* Protected Routes - Require Login and Subscription */}
        <Route path="/progress" element={
          <PrivateRoute>
            <Progress />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Dashboard />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/workouts" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Workouts />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/workouts/:slug" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <WorkoutDetail />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/nutrition" element={<Navigate to="/recipes" replace />} />
        <Route path="/recipes" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Recipes />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/recipes/:slug" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <RecipeDetail />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/wellness" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Wellness />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/community" element={
          <PrivateRoute>
            <Community />
          </PrivateRoute>
        } />
        <Route path="/community/groups/:slug" element={
          <PrivateRoute>
            <GroupDetail />
          </PrivateRoute>
        } />
        <Route path="/community/birth-ball" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallCommunityFeed />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Profile />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/questionnaire" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Questionnaire />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/meal-plan" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <MealPlan />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/meal-plan/:slug" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <MealPlanDetail />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/workout-plan" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <WorkoutPlan />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/saved-workout-plans" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <SavedWorkoutPlans />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/saved-workout-plans/:planId" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <WorkoutPlanDetail />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        
        {/* Birth Ball Guide Routes */}
        <Route path="/birth-ball-guide" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallGuide />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/birth-ball-guide/:trimester" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallTrimester />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/birth-ball-guide/exercise/:exerciseId" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallExercise />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/birth-ball-guide/buying-guide" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallBuyingGuide />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/birth-ball-guide/safety" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallSafety />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/birth-ball-guide/faq" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallFAQ />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/birth-ball-guide/education" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallEducation />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/birth-ball-guide/early-labor" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallEarlyLabor />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/birth-ball-guide/breathing-practice" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallBreathingPractice />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/birth-ball-guide/saved" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <SavedBirthBallExercises />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        
        <Route path="/courses" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Courses />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/course/:id" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <CourseDetail />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/programs/glow-and-go" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <GlowAndGo />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="/wellness/self-care" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <SelfCareGuide />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/wellness/resources" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <WellnessResources />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/wellness/article/:id" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <WellnessArticle />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/blog-preview" element={
          <PrivateRoute>
            <BlogPreview />
          </PrivateRoute>
        } />
        <Route path="/saved-birth-ball-exercises" element={
          <PrivateRoute>
            <SavedBirthBallExercises />
          </PrivateRoute>
        } />
        <Route path="/assessment-results" element={
          <PrivateRoute>
            <AssessmentResults />
          </PrivateRoute>
        } />
        <Route path="/credit-purchase-success" element={<CreditPurchaseSuccess />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
      />
      <GlobalVideoPlayer />
      <CookieConsentBanner />
    </BrowserRouter>
    </ErrorBoundary>
  );
}

const App = () => (
  <HelmetProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <VideoPlayerProvider>
              <AppContent />
            </VideoPlayerProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
