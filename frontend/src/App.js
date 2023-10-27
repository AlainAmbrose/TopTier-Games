import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LibraryPage from "./pages/LibraryPage";
import "./App.css";
import HomePage from "./pages/HomePage";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingPage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/library" element={<LibraryPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
