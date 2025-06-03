import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useSession();
  const [isValidUser, setIsValidUser] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        setIsValidUser(userSnap.exists());
      } else {
        setIsValidUser(false);
      }
      setChecking(false);
    };

    checkUser();
  }, [user]);

  if (isLoading || checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <MoonLoader color="#E60000" />
      </div>
    );
  }

  return user && isValidUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
