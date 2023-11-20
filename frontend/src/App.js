import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LibraryPage from "./pages/LibraryPage";
import HomePage from "./pages/HomePage";
import "./App.css";
import "react-loading-skeleton/dist/skeleton.css"
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthProvider from './components/Authorizations/AuthContext';
import AuthProviderWithNavigation from './components/Authorizations/AuthProviderWithNavigation';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProviderWithNavigation>
            <Routes>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/home" element={<HomePage />}></Route>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/signup" element={<SignUpPage />}></Route>
              <Route path="/library" element={<LibraryPage />}></Route>
            </Routes>
          </AuthProviderWithNavigation>    
        </Router>
    </QueryClientProvider>
  );
}

export default App;
