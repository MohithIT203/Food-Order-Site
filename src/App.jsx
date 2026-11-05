import { Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header.jsx";
import SignIn from "./pages/SignIn.jsx";
import Home from "./pages/Home.jsx";
import Orders from "./pages/Orders.jsx";
import Cart from "./pages/Cart.jsx";

import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";

import Profile from "./pages/Profile.jsx";
import ProtectedRoutesAdmin from "./components/ProtectedRoutesAdmin.jsx";
import Coupons from "./pages/Coupons.jsx";
import NotFound from "./pages/NotFound.jsx";

const PublicRoute = ({ children }) => {
  const user = localStorage.getItem("currentUser");
  return user ? <Navigate to="/home" replace /> : children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <>
                <Header />
              </>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route element={<ProtectedRoutesAdmin />}>
              <Route path="/coupons" element={<Coupons />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound/>}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
