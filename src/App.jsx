import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
import LandingScreen from "./screens/LandingScreen";
import ForgotPassScreen from "./screens/ForgotPassScreen";
import VerifyScreen from "./screens/VerifyScreen";
import SetPassScreen from "./screens/SetPassScreen";
import Dashboard from "./screens/DashboardScreen";
import ListingScreen from "./screens/ListingScreen";
import { auth } from "./config/firebaseConfig";
import { SessionProvider, useSession } from "./context/SessionContext";
import PrivateRoute from "./components/PrivateRoute";
import ProfileScreen from "./screens/ProfileScreen";
import MessagingScreen from "./screens/MessagingScreen";
import TransactionScreen from "./screens/TransactionScreen";
import BookingScreen from "./screens/BookingScreen";
import { checkUserBan } from "./hooks/banService";
import BanModal from "./components/General/BanModal";
import { MoonLoader } from "react-spinners";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db } from "./config/firebaseConfig";

// Create a wrapper component to handle ban checks
const BanCheckWrapper = ({ children }) => {
  const [isBanned, setIsBanned] = useState(false);
  const [banData, setBanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);
  const location = useLocation();
  const { user } = useSession();

  useEffect(() => {
    const checkBan = async () => {
      if (user) {
        const banCheck = await checkUserBan(user.uid);
        setIsBanned(banCheck.isBanned);
        if (banCheck.isBanned) {
          setBanData(banCheck.banData);
          setShowBanModal(true);
        }
      }
      setIsLoading(false);
    };

    checkBan();
  }, [user]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <MoonLoader color="#E60000" />
      </div>
    );
  }

  // If user is banned and not on dashboard, redirect to dashboard
  if (isBanned && location.pathname !== "/dashboard") {
    return (
      <>
        <Navigate to="/dashboard" replace />
        <BanModal 
          isOpen={showBanModal} 
          banData={banData} 
          onClose={() => setShowBanModal(false)} 
        />
      </>
    );
  }

  return (
    <>
      {children}
      {isBanned && (
        <BanModal 
          isOpen={showBanModal} 
          banData={banData} 
          onClose={() => setShowBanModal(false)} 
        />
      )}
    </>
  );
};

// Wrap the routes with SessionProvider
const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSession();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setIsLoggedIn(true);
        } else {
          // If user doesn't exist in Firestore, sign them out
          await signOut(auth);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <MoonLoader color="#E60000" />
      </div>
    );
  }

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgotpass', '/verify', '/setpass'];

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingScreen />} />
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
      <Route path="/setpass" element={<SetPassScreen />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <BanCheckWrapper>
              <Dashboard />
            </BanCheckWrapper>
          </PrivateRoute>
        }
      />
      <Route
        path="/listings"
        element={
          <PrivateRoute>
            <BanCheckWrapper>
              <ListingScreen />
            </BanCheckWrapper>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <BanCheckWrapper>
              <ProfileScreen />
            </BanCheckWrapper>
          </PrivateRoute>
        }
      />
      <Route
        path="/messaging"
        element={
          <PrivateRoute>
            <BanCheckWrapper>
              <MessagingScreen />
            </BanCheckWrapper>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <BanCheckWrapper>
              <TransactionScreen />
            </BanCheckWrapper>
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <BanCheckWrapper>
              <BookingScreen />
            </BanCheckWrapper>
          </PrivateRoute>
        }
      />

      {/* Catch all route - redirect to login for any non-existent route */}
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <SessionProvider>
      <Router>
        <AppRoutes />
      </Router>
    </SessionProvider>
  );
}

export default App;
