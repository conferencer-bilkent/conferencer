import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./context/UserContext";

const PrivateRoute: React.FC = () => {
  const { user } = useUser();

  // if not logged in, kick them back to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // otherwise render the nested route(s)
  return <Outlet />;
};

export default PrivateRoute;
