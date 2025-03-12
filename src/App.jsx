import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
import LandingScreen from "./screens/LandingScreen";
import ForgotPassScreen from "./screens/ForgotPassScreen";
import VerifyScreen from "./screens/VerifyScreen";
import SetPassScreen from "./screens/SetPassScreen";
import Dashboard from "./screens/DashboardScreen";
import ListingScreen from "./screens/ListingScreen";
import { auth } from "./config/firebaseConfig";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingScreen />} />
        <Route path="/forgotpass" element={<ForgotPassScreen />} />
        <Route path="/verify" element={<VerifyScreen />} />
        {isLoggedIn ? (
          <>
            <Route path="/setpass" element={<SetPassScreen />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/listing" element={<ListingScreen />} />
          </>
        ) : (
          <>
            <Route path="/" element={<LandingScreen />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
