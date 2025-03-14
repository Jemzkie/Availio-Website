import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const PrivateRoute = ({ element }) => {
  const { user, isLoading } = useSession();

  if (isLoading) return null; // Or add a loading spinner if you prefer

  // ✅ Redirect to login if the user is not authenticated
  return user ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
