import React, { Suspense, lazy } from "react";

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
import { RemoteSyncProvider } from "@/contexts/RemoteSyncContext";
import RemoteControllerOverlay from "@/components/remote/RemoteControllerOverlay";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CheckoutModal from "./components/subscription/CheckoutModal";
import PrivateRoute from "./components/auth/PrivateRoute";
import SubscriptionGuard from "./components/auth/SubscriptionGuard";
import SubscriptionRefresher from "./components/auth/SubscriptionRefresher";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import PresenceTracker from "./components/presence/PresenceTracker";
import AdminGiftListener from "./components/notifications/AdminGiftListener";
import PWAInstallBanner from "./components/pwa/PWAInstallBanner";

// Create a client
const queryClient = new QueryClient();

// Lazy-loaded so it doesn't affect initial bundle
const AssessmentGuideChat = lazy(() =>
  import('@/components/subscription/AssessmentGuideChat')
);

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Coach = lazy(() => import("./pages/Coach"));
const Workouts = lazy(() => import("./pages/Workouts"));
const WorkoutDetail = lazy(() => import("./pages/WorkoutDetail"));
const CoreRestoreFoundationsProgram = lazy(() => import("./pages/CoreRestoreFoundationsProgram"));
const Wellness = lazy(() => import("./pages/Wellness"));
const Community = lazy(() => import("./pages/Community"));
const GroupDetail = lazy(() => import("./pages/GroupDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const FoodCalorieChecker = lazy(() => import("./pages/FoodCalorieChecker"));
const Questionnaire = lazy(() => import("./pages/Questionnaire"));
const MealPlan = lazy(() => import("./pages/MealPlan"));
const MealPlanDetail = lazy(() => import("./pages/MealPlanDetail"));
const WorkoutPlan = lazy(() => import("./pages/WorkoutPlan"));
const SavedWorkoutPlans = lazy(() => import("./pages/SavedWorkoutPlans"));
const WorkoutPlanDetail = lazy(() => import("./pages/WorkoutPlanDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Experts = lazy(() => import("./pages/Experts"));
const Research = lazy(() => import("./pages/Research"));
const FAQ = lazy(() => import("./pages/FAQ"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const GlowAndGo = lazy(() => import("./pages/GlowAndGo"));
const BirthBallProgram = lazy(() => import("./pages/BirthBallProgram"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const BlogPreview = lazy(() => import("./pages/BlogPreview"));
const SelfCareGuide = lazy(() => import("./pages/wellness/SelfCareGuide"));
const WellnessResources = lazy(() => import("./pages/wellness/WellnessResources"));
const WellnessArticle = lazy(() => import("./pages/wellness/WellnessArticle"));
const Progress = lazy(() => import("./pages/Progress"));
const BirthBallGuide = lazy(() => import("./pages/BirthBallGuide"));
const BirthBallTrimester = lazy(() => import("./pages/BirthBallTrimester"));
const BirthBallExercise = lazy(() => import("./pages/BirthBallExercise"));
const BirthBallBuyingGuide = lazy(() => import("./pages/BirthBallBuyingGuide"));
const BirthBallSafety = lazy(() => import("./pages/BirthBallSafety"));
const BirthBallFAQ = lazy(() => import("./pages/BirthBallFAQ"));
const BirthBallEducation = lazy(() => import("./pages/BirthBallEducation"));
const BirthBallEarlyLabor = lazy(() => import("./pages/BirthBallEarlyLabor"));
const SavedBirthBallExercises = lazy(() => import("./pages/SavedBirthBallExercises"));
const AssessmentResults = lazy(() => import("./pages/AssessmentResults"));
const BirthBallCommunityFeed = lazy(() => import("./pages/BirthBallCommunityFeed"));
const BirthBallBreathingPractice = lazy(() => import("./pages/BirthBallBreathingPractice"));
const CreditPurchaseSuccess = lazy(() => import("./pages/CreditPurchaseSuccess"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const MedicalDisclaimer = lazy(() => import("./pages/MedicalDisclaimer"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const DiastasisRectiRedditReviews = lazy(() => import("./pages/DiastasisRectiRedditReviews"));
const PostpartumBodyChangesGuide = lazy(() => import("./pages/PostpartumBodyChangesGuide"));
const CSectionPrepChecklist = lazy(() => import("./pages/CSectionPrepChecklist"));
const BreastfeedingWithoutGuilt = lazy(() => import("./pages/BreastfeedingWithoutGuilt"));
const ExhaustedMomSleepGuide = lazy(() => import("./pages/ExhaustedMomSleepGuide"));
const Guides = lazy(() => import("./pages/Guides"));
const BabyTrackingAnxiety = lazy(() => import("./pages/BabyTrackingAnxiety"));
const HonestPregnancyTruths = lazy(() => import("./pages/HonestPregnancyTruths"));
const PostpartumFreezerMeals = lazy(() => import("./pages/PostpartumFreezerMeals"));
const BuildYourVillage = lazy(() => import("./pages/BuildYourVillage"));
const BabyAllergenTracker = lazy(() => import("./pages/BabyAllergenTracker"));

function AppContent() {
  const { showCheckoutModal, setShowCheckoutModal } = useAuth();
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Helmet>
          <title>Catalyst Mom | Wellness, Fitness & Nutrition</title>
          <meta name="description" content="Personalized wellness, fitness, and nutrition for moms. Join our community for workouts, meal plans, and support." />
          <link rel="canonical" href={`https://catalystmomofficial.com${window.location.pathname}`} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Catalyst Mom | Wellness, Fitness & Nutrition" />
          <meta property="og:description" content="Personalized wellness, fitness, and nutrition for moms." />
          <meta property="og:url" content={`https://catalystmomofficial.com${window.location.pathname}`} />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Catalyst Mom",
            "url": "https://catalystmomofficial.com",
            "logo": "https://catalystmomofficial.com/catalyst-mom-logo.png",
            "sameAs": ["https://www.instagram.com/catalyst_mom", "https://www.pinterest.com/catalystmoms/"],
            "dateModified": new Date().toISOString().split('T')[0],
          })}</script>
        </Helmet>
        <ScrollToTop />
        <SubscriptionRefresher />
        <GoogleAuthOnboarding />
        <PresenceTracker />
        <AdminGiftListener />
        <Toaster />
        <Sonner />
        {/* Assessment guide chat — persists on homepage after "Not now",
            also rendered as a sibling in SubscriptionGuard on the paywall */}
        <Suspense fallback={null}>
          <AssessmentGuideChat />
        </Suspense>
      <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/diastasis-recti-recovery-program-reviews-reddit" element={<DiastasisRectiRedditReviews />} />
        <Route path="/postpartum-body-changes-what-nobody-tells-you" element={<PostpartumBodyChangesGuide />} />
        <Route path="/c-section-prep-checklist" element={<CSectionPrepChecklist />} />
        <Route path="/stop-breastfeeding-without-guilt" element={<BreastfeedingWithoutGuilt />} />
        <Route path="/exhausted-mom-sleep-troubleshooting" element={<ExhaustedMomSleepGuide />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/baby-tracking-anxiety" element={<BabyTrackingAnxiety />} />
        <Route path="/honest-pregnancy-truths" element={<HonestPregnancyTruths />} />
        <Route path="/postpartum-freezer-meal-prep" element={<PostpartumFreezerMeals />} />
        <Route path="/build-your-village" element={<BuildYourVillage />} />
        <Route path="/baby-allergen-tracker" element={<BabyAllergenTracker />} />
        
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
        {/* The coach is the front door to every tool, so it stays reachable to
            any signed-in mom rather than sitting behind the subscription gate. */}
        <Route path="/coach" element={
          <PrivateRoute>
            <Coach />
          </PrivateRoute>
        } />

        <Route path="/workouts" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Workouts />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/workouts/core-restore-foundations" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <CoreRestoreFoundationsProgram />
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
        <Route path="/nutrition" element={<Navigate to="/meal-plan" replace />} />
        <Route path="/recipes" element={<Navigate to="/meal-plan" replace />} />
        <Route path="/wellness" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Wellness />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/community" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <Community />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/community/groups/:slug" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <GroupDetail />
            </SubscriptionGuard>
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
        <Route path="/birth-ball-guide" element={<BirthBallGuide />} />
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
        <Route path="/birth-ball-guide/buying-guide" element={<BirthBallBuyingGuide />} />
        <Route path="/birth-ball-guide/safety" element={<BirthBallSafety />} />
        <Route path="/birth-ball-guide/faq" element={<BirthBallFAQ />} />
        <Route path="/birth-ball-guide/education" element={<BirthBallEducation />} />
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
        <Route path="/programs/birth-ball" element={
          <PrivateRoute>
            <SubscriptionGuard>
              <BirthBallProgram />
            </SubscriptionGuard>
          </PrivateRoute>
        } />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/affiliate/dashboard" element={
          <PrivateRoute>
            <AffiliateDashboard />
          </PrivateRoute>
        } />
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
      </Suspense>
      
      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
      />
      <GlobalVideoPlayer />
      <RemoteControllerOverlay />
      <CookieConsentBanner />
      <PWAInstallBanner />
    </BrowserRouter>
    </ErrorBoundary>
  );
}

const isStandalonePWA = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true);

// Only show splash on a true app launch (cold start), not on in-app
// navigation, soft refreshes, or back/forward restores within a session.
const shouldShowSplashOnLaunch = () => {
  if (typeof window === 'undefined') return false;
  if (!isStandalonePWA()) return false;
  try {
    if (sessionStorage.getItem('cm_splash_shown') === '1') return false;
    const nav = performance.getEntriesByType?.('navigation')?.[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav && (nav.type === 'reload' || nav.type === 'back_forward')) {
      sessionStorage.setItem('cm_splash_shown', '1');
      return false;
    }
  } catch {}
  return true;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(shouldShowSplashOnLaunch);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!showSplash) return;
    try { sessionStorage.setItem('cm_splash_shown', '1'); } catch {}
    const fadeTimer = setTimeout(() => setFadeOut(true), 3800);
    const removeTimer = setTimeout(() => setShowSplash(false), 4200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen fadeOut={fadeOut} />;
  }

  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <RemoteSyncProvider>
                <VideoPlayerProvider>
                  <AppContent />
                </VideoPlayerProvider>
              </RemoteSyncProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
