import { type ReactNode } from "react";
import { useAuthStore } from "../store/auth-store";
import { Navigate } from "react-router-dom";


interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
  }
const ProtectedRoute = ({children,allowedRoles}:ProtectedRouteProps) => {
    const {isAuthenticated,user}=useAuthStore();
    if(!isAuthenticated){
        return <Navigate to="/" replace />;
    }

    if(allowedRoles&&
        user&&
        !allowedRoles.includes(user.role)
    ){
        return <Navigate to="/unauthorized" replace />;
    }
  return children;
}

export default ProtectedRoute