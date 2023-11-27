import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LibraryPage from "./pages/LibraryPage";
import HomePage from "./pages/HomePage";
import EmailAuthPage from "./pages/EmailAuthPage";
import "./App.css";
import "react-loading-skeleton/dist/skeleton.css";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider from "./components/Authorizations/AuthContext";
import AuthProviderWithNavigation from "./components/Authorizations/AuthProviderWithNavigation";
import PasswordResetPage from "./pages/PasswordResetPage";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProviderWithNavigation>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/auth/:isPasswordReset" element={<EmailAuthPage />} />
            <Route path="/passwordReset" element={<PasswordResetPage />} />
          </Routes>
        </AuthProviderWithNavigation>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
