import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutesAdmin() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userRole = user.role;
  if (userRole!=="admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoutesAdmin;