
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import GlobalVideoPlayer from "./components/video/GlobalVideoPlayer";
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
import Profile from "./pages/Profile";
import PrivateRoute from "./components/auth/PrivateRoute";
import SubscriptionGuard from "./components/auth/SubscriptionGuard";
import FoodCalorieChecker from "./pages/FoodCalorieChecker";
import Questionnaire from "./pages/Questionnaire";
import MealPlan from "./pages/MealPlan";
import MealPlanDetail from "./pages/MealPlanDetail";
import WorkoutPlan from "./pages/WorkoutPlan";
import SavedWorkoutPlans from "./pages/SavedWorkoutPlans";
import WorkoutPlanDetail from "./pages/WorkoutPlanDetail";
import Blog from "./pages/Blog";
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
import SelfCareGuide from "./pages/wellness/SelfCareGuide";
import WellnessResources from "./pages/wellness/WellnessResources";
import WellnessArticle from "./pages/wellness/WellnessArticle";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Create a client
const queryClient = new QueryClient();

function AppContent() {
  const { showCheckoutModal, setShowCheckoutModal } = useAuth();
  const location = useLocation();
  
  return (
    <BrowserRouter>
      <Helmet>
        <title>Catalyst Mom | Wellness, Fitness & Nutrition</title>
        <meta name="description" content="Personalized wellness, fitness, and nutrition for moms. Join our community for workouts, meal plans, and support." />
        <link rel="canonical" href={`${window.location.origin}${location.pathname}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Catalyst Mom | Wellness, Fitness & Nutrition" />
        <meta property="og:description" content="Personalized wellness, fitness, and nutrition for moms." />
        <meta property="og:url" content={`${window.location.origin}${location.pathname}`} />
      </Helmet>
      <ScrollToTop />
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/food-calories" element={<FoodCalorieChecker />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/research" element={<Research />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/workouts" element={
          <PrivateRoute>
            <Workouts />
          </PrivateRoute>
        } />
        <Route path="/workouts/:slug" element={
          <PrivateRoute>
            <WorkoutDetail />
          </PrivateRoute>
        } />
        <Route path="/recipes" element={
          <PrivateRoute>
            <Recipes />
          </PrivateRoute>
        } />
        <Route path="/recipes/:slug" element={
          <PrivateRoute>
            <RecipeDetail />
          </PrivateRoute>
        } />
        <Route path="/wellness" element={
          <PrivateRoute>
            <Wellness />
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
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/questionnaire" element={
          <PrivateRoute>
            <Questionnaire />
          </PrivateRoute>
        } />
        <Route path="/meal-plan" element={
          <PrivateRoute>
            <MealPlan />
          </PrivateRoute>
        } />
        <Route path="/meal-plan/:slug" element={
          <PrivateRoute>
            <MealPlanDetail />
          </PrivateRoute>
        } />
        <Route path="/workout-plan" element={
          <PrivateRoute>
            <WorkoutPlan />
          </PrivateRoute>
        } />
        <Route path="/saved-workout-plans" element={
          <PrivateRoute>
            <SavedWorkoutPlans />
          </PrivateRoute>
        } />
        <Route path="/saved-workout-plans/:planId" element={
          <PrivateRoute>
            <WorkoutPlanDetail />
          </PrivateRoute>
        } />
        <Route path="/courses" element={
          <PrivateRoute>
            <Courses />
          </PrivateRoute>
        } />
        <Route path="/course/:id" element={
          <PrivateRoute>
            <CourseDetail />
          </PrivateRoute>
        } />
        <Route path="/programs/glow-and-go" element={
          <PrivateRoute>
            <GlowAndGo />
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
            <SelfCareGuide />
          </PrivateRoute>
        } />
        <Route path="/wellness/resources" element={
          <PrivateRoute>
            <WellnessResources />
          </PrivateRoute>
        } />
        <Route path="/wellness/article/:id" element={
          <PrivateRoute>
            <WellnessArticle />
          </PrivateRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
      />
      <GlobalVideoPlayer />
    </BrowserRouter>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
