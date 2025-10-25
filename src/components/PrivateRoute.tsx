import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentAuth } from "../react-redux/features/authSlice";
import { Navigate } from "react-router";

type Props = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: Props) => {
  const auth = useSelector(selectCurrentAuth);

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
