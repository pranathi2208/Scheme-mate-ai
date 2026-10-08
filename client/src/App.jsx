import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ProtectedRoute, PublicOnlyRoute } from './components/common/ProtectedRoute';
import { PageLoader } from './components/common/LoadingSpinner';

// Lazy-loaded pages
const LandingPage       = lazy(() => import('./pages/LandingPage'));
const LoginPage         = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/auth/RegisterPage'));
const OnboardingPage    = lazy(() => import('./pages/onboarding/OnboardingPage'));
const MySchemes         = lazy(() => import('./pages/schemes/MySchemes'));
const ExplorePage       = lazy(() => import('./pages/schemes/ExplorePage'));
const SchemeDetailPage  = lazy(() => import('./pages/schemes/SchemeDetailPage'));
const SavedSchemesPage  = lazy(() => import('./pages/schemes/SavedSchemesPage'));
const AssistantPage     = lazy(() => import('./pages/AssistantPage'));
const ProfilePage       = lazy(() => import('./pages/ProfilePage'));
const AdminLoginPage    = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'));

function MainLayout({ children, showFooter = true }) {
  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes with navbar */}
            <Route path="/" element={
              <MainLayout>
                <LandingPage />
              </MainLayout>
            } />

            <Route path="/explore" element={
              <MainLayout>
                <ExplorePage />
              </MainLayout>
            } />

            <Route path="/schemes/:idOrSlug" element={
              <MainLayout>
                <SchemeDetailPage />
              </MainLayout>
            } />

            <Route path="/assistant" element={
              <MainLayout showFooter={false}>
                <AssistantPage />
              </MainLayout>
            } />

            {/* Auth routes - redirect if logged in */}
            <Route path="/login" element={
              <PublicOnlyRoute>
                <MainLayout showFooter={false}>
                  <LoginPage />
                </MainLayout>
              </PublicOnlyRoute>
            } />

            <Route path="/register" element={
              <PublicOnlyRoute>
                <MainLayout showFooter={false}>
                  <RegisterPage />
                </MainLayout>
              </PublicOnlyRoute>
            } />

            {/* Protected routes */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <MainLayout showFooter={false}>
                  <OnboardingPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/my-schemes" element={
              <ProtectedRoute>
                <MainLayout>
                  <MySchemes />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/saved-schemes" element={
              <ProtectedRoute>
                <MainLayout>
                  <SavedSchemesPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin/login" element={
              <AdminLayout>
                <AdminLoginPage />
              </AdminLayout>
            } />

            <Route path="/admin/*" element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            } />

            {/* 404 */}
            <Route path="*" element={
              <MainLayout>
                <NotFoundPage />
              </MainLayout>
            } />
          </Routes>
        </Suspense>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
