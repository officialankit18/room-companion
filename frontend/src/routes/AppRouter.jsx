import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PublicLayout } from "../layouts/PublicLayout";
import { LandingPage } from "../pages/LandingPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";

export function AppRouter() {
  return (
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
                description="Authentication screens will be implemented after the shared UI system and API layer are ready."
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
          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page not found"
                description="The page you are looking for does not exist."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

