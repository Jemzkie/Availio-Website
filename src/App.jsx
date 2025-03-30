import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
import LandingScreen from "./screens/LandingScreen";
import ForgotPassScreen from "./screens/ForgotPassScreen";
import VerifyScreen from "./screens/VerifyScreen";
import SetPassScreen from "./screens/SetPassScreen";
import Dashboard from "./screens/DashboardScreen";
import ListingScreen from "./screens/ListingScreen";
import CreateListingScreen from "./screens/CreateListingScreen";
import { auth } from "./config/firebaseConfig";
import { SessionProvider } from "./context/SessionContext";
import PrivateRoute from "./components/PrivateRoute";
import ProfileScreen from "./screens/ProfileScreen";
import MessagingScreen from "./screens/MessagingScreen";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("triggered");
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="/forgotpass" element={<ForgotPassScreen />} />
          <Route path="/verify" element={<VerifyScreen />} />

          {/* ✅ Use PrivateRoute for protected routes */}
          <Route
            path="/setpass"
            element={<PrivateRoute element={<SetPassScreen />} />}
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/listing"
            element={<PrivateRoute element={<ListingScreen />} />}
          />
          <Route
            path="/messaging"
            element={<PrivateRoute element={<MessagingScreen />} />}
          />
          <Route
            path="/create-listing"
            element={<PrivateRoute element={<CreateListingScreen />} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<ProfileScreen />} />}
          />

          {/* ✅ Redirect invalid routes to "/" */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </SessionProvider>
  );
}

export default App;
