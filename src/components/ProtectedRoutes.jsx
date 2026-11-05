import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;