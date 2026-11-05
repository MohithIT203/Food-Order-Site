import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { themeSlice } from "../store/theme";
import UserPill from "./User";
import { FaShoppingCart,FaUtensils } from "react-icons/fa";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { username, role } = JSON.parse(localStorage.getItem("currentUser"));
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.mode);
  const cartCount = useSelector((state) => state.cart.items);

  const avatar = username.charAt(0).toUpperCase();

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/");
  }

  function handleUserPage() {
    navigate("/profile");
  }
  return (
    <>
      <nav className="header">
        <div className="header-left">
          <div className="brand">
            <div className="brand-icon"><FaUtensils style={{color:"white"}}/></div>
            {/* <div className="brand-icon"><FaBowlRice style={{color:"white"}}/></div> */}
            <span>Food Ordering</span>
          </div>
          <div className="nav-links desktop-only">
            <NavLink to="/home" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          </div>
        </div>

        <div className="header-right">
          <button
            className="theme-btn"
            onClick={() => dispatch(themeSlice.actions.toggleTheme())}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          {/* <div className="user-pill"onClick={handleUserPage}>
            <div className="user-avatar">{avatar}</div>
            <span className="user-name">{username}</span>
            <div className="user-details">
                <button>Profile</button>
                <button>Log-out</button>
            </div>
          </div> */}
          <UserPill
            avatar={avatar}
            username={username}
            onProfile={handleUserPage}
            onLogout={handleLogout}
          />
          {role === "customer" && (
            <button className="cart-btn" onClick={() => navigate("/cart")}>
              <FaShoppingCart style={{position:"relative",top:"1px"}}/> <span className="cart-badge">{cartCount.length || "0"}</span>
            </button>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </button>
          {/* <button className="log-out-btn-dt" onClick={handleLogout}>
            Logout
          </button> */}
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <NavLink
            to="/home"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/orders"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </NavLink>
          <NavLink
            to="/profile"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </NavLink>
          <button className="log-out-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <Outlet />
    </>
  );
}
export default Header;
