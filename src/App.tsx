
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/WorkoutDetail";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Wellness from "./pages/Wellness";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/auth/PrivateRoute";
import FoodCalorieChecker from "./pages/FoodCalorieChecker";
import Questionnaire from "./pages/Questionnaire";
import MealPlan from "./pages/MealPlan";
import WorkoutPlan from "./pages/WorkoutPlan";
import Blog from "./pages/Blog";
import Experts from "./pages/Experts";
import Research from "./pages/Research";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
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
            <Route path="/workout-plan" element={
              <PrivateRoute>
                <WorkoutPlan />
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
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
