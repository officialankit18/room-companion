import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../auth/AuthContext";
import { USER_ROLES } from "../constants/roles";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminListingsPage } from "../pages/admin/AdminListingsPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { AboutPage } from "../pages/AboutPage";
import { BrowseListingsPage } from "../pages/BrowseListingsPage";
import { ChatPage } from "../pages/chat/ChatPage";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { NotificationsPage } from "../pages/notifications/NotificationsPage";
import { OwnerDashboardPage } from "../pages/owner/OwnerDashboardPage";
import { OwnerListingsPage } from "../pages/owner/OwnerListingsPage";
import { OwnerRequestsPage } from "../pages/owner/OwnerRequestsPage";
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
                element={<ChatPage />}
              />
              <Route path="/tenant/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.OWNER]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                path="/owner"
                element={<OwnerDashboardPage />}
              />
              <Route path="/owner/listings" element={<OwnerListingsPage />} />
              <Route path="/owner/requests" element={<OwnerRequestsPage />} />
              <Route
                path="/owner/chat"
                element={<ChatPage />}
              />
              <Route path="/owner/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                path="/admin"
                element={<AdminDashboardPage />}
              />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/listings" element={<AdminListingsPage />} />
              <Route path="/admin/notifications" element={<NotificationsPage />} />
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
