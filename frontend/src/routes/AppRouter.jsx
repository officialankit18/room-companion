import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../auth/AuthContext";
import { USER_ROLES } from "../constants/roles";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { AboutPage } from "../pages/AboutPage";
import { BrowseListingsPage } from "../pages/BrowseListingsPage";
import { DashboardPlaceholder } from "../pages/DashboardPlaceholder";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { RegisterPage } from "../pages/RegisterPage";
import { TenantDashboardPage } from "../pages/tenant/TenantDashboardPage";
import { TenantInterestsPage } from "../pages/tenant/TenantInterestsPage";
import { TenantMatchesPage } from "../pages/tenant/TenantMatchesPage";
import { TenantProfilePage } from "../pages/tenant/TenantProfilePage";
import { VerifyEmailPage } from "../pages/VerifyEmailPage";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route
              path="/browse"
              element={<BrowseListingsPage />}
            />
            <Route
              path="/about"
              element={<AboutPage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.TENANT]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                path="/tenant"
                element={<TenantDashboardPage />}
              />
              <Route path="/tenant/profile" element={<TenantProfilePage />} />
              <Route path="/tenant/matches" element={<TenantMatchesPage />} />
              <Route path="/tenant/interests" element={<TenantInterestsPage />} />
              <Route
                path="/tenant/chat"
                element={
                  <DashboardPlaceholder
                    title="Tenant chat"
                    description="Realtime chat will be connected in the chat frontend phase."
                  />
                }
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.OWNER]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                path="/owner"
                element={
                  <DashboardPlaceholder
                    title="Owner dashboard"
                    description="Manage listings, review interested tenants, approve requests, and chat after acceptance."
                  />
                }
              />
              <Route
                path="/owner/*"
                element={
                  <DashboardPlaceholder
                    title="Owner workspace"
                    description="Owner feature screens will be built in the owner dashboard phase."
                  />
                }
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                path="/admin"
                element={
                  <DashboardPlaceholder
                    title="Admin dashboard"
                    description="Monitor platform activity, users, and listings from one workspace."
                  />
                }
              />
              <Route
                path="/admin/*"
                element={
                  <DashboardPlaceholder
                    title="Admin workspace"
                    description="Admin feature screens will be built in the admin dashboard phase."
                  />
                }
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page not found"
                description="The page you are looking for does not exist."
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
