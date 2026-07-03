import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../auth/AuthContext";
import { USER_ROLES } from "../constants/roles";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { DashboardPlaceholder } from "../pages/DashboardPlaceholder";
import { LandingPage } from "../pages/LandingPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
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
              element={
                <PlaceholderPage
                  title="Browse listings"
                  description="Listing search, filters, and AI match ranking will be connected in the tenant phases."
                />
              }
            />
            <Route
              path="/about"
              element={
                <PlaceholderPage
                  title="About RoomCompanion"
                  description="A professional room discovery platform built around compatibility, owner approval, and chat."
                />
              }
            />
            <Route
              path="/login"
              element={
                <PlaceholderPage
                  title="Login"
                  description="Authentication screens will be implemented in the public pages phase."
                />
              }
            />
            <Route
              path="/register"
              element={
                <PlaceholderPage
                  title="Register"
                  description="Tenant and owner registration will connect to the backend OTP verification flow."
                />
              }
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.TENANT]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                path="/tenant"
                element={
                  <DashboardPlaceholder
                    title="Tenant dashboard"
                    description="Manage your profile, browse AI-ranked rooms, track interests, and chat with accepted owners."
                  />
                }
              />
              <Route
                path="/tenant/*"
                element={
                  <DashboardPlaceholder
                    title="Tenant workspace"
                    description="Tenant feature screens will be built in the tenant dashboard phase."
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
