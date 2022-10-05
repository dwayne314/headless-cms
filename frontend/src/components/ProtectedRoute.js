import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { isFalsy } from "../utils";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (isFalsy(user)) {
    // Flash You must login to continue
    return <Navigate to={"/login"} replace />;
  } else {
    return children;
  }
};

export default ProtectedRoute;
