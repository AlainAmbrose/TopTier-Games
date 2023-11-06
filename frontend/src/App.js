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

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/library" element={<LibraryPage />}></Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
