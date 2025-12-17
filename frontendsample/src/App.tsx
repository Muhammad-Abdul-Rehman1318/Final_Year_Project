import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//protected route
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import CandidateProtectedRoute from "./components/CandidateProtectedRoute";

// Marketing pages
import HomePage from "@/pages/marketing/HomePage";
import PricingPage from "@/pages/marketing/PricingPage";
import HowItWorksPage from "@/pages/marketing/HowItWorksPage";
import ContactPage from "@/pages/marketing/ContactPage";
// Authentication pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/company/ForgotPasswordPage";
import ResetPasswordPage from '@/pages/company/ResetPasswordPage';
import CandidateLoginPage from "@/pages/auth/CandidateLoginPage";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";
import AdminRegisterPage from "@/pages/auth/AdminRegisterPage";

// Company pages
import CompanyLayout from "@/layouts/CompanyLayout";
import CompanyDashboard from "@/pages/company/Dashboard";
import JobsListingPage from "@/pages/company/JobsListingPage";
import JobDetailsPage from "@/pages/company/JobDetailsPage";
import CreateJobPage from "@/pages/company/CreateJobPage";
import InterviewsListingPage from "@/pages/company/InterviewsListingPage";
import InterviewDetailsPage from "@/pages/company/InterviewDetailsPage";
import TeamManagementPage from "@/pages/company/TeamManagementPage";
import AccountSettingsPage from "./pages/company/AccountSettingsPage";
import HeroSection from "@/pages/company/HeroSection";
import UniversitySearchFiltersPage from "@/pages/company/UniversityFilters";
import FavoritesPage from "@/pages/company/FavoritesPanel";
import DisciplineSearch from "@/pages/company/DisciplineSearch";
import RankingSearch from "@/pages/company/RankingSearch";

import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import CompanyManagementPage from "@/pages/admin/CompanyManagementPage";
import ContactInformationPage from "@/pages/admin/ContactInformationPage";


// Other
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/admin/Dashboard";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Marketing routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
        

          {/* Public Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:id/:token" element={<ResetPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/candidate/login/:token" element={<CandidateLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/* Legal Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Protected Company routes */}
          <Route
            path="/company"
            element={
              <ProtectedRoute>
                <CompanyLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CompanyDashboard />} />
            <Route path="jobs" element={<JobsListingPage />} />
            <Route path="jobs/create" element={<CreateJobPage />} />
            <Route path="jobs/:id" element={<JobDetailsPage />} />
            <Route path="interviews" element={<InterviewsListingPage />} />
            <Route path="interviews/:id" element={<InterviewDetailsPage />} />
            <Route path="team" element={<TeamManagementPage />} />

            <Route path="settings" element={<AccountSettingsPage />} />
            <Route path="hero-section" element={<HeroSection />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="ranking-search" element={<RankingSearch/>} />
            <Route path="discipline-search" element={<DisciplineSearch />} />


          </Route>

          {/* Protected Candidate routes */}


          {/* Companies route accessible at /companies */}
          <Route
            path="/companies"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Route index element={<CompanyManagementPage />} />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* Protected Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="companies" element={<CompanyManagementPage />} />
            <Route path="contact-information" element={<ContactInformationPage />} />
           
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;