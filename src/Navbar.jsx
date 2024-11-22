import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Error logging out:", err.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="logo-container" to="/"><h1 className="logo">Fast Finite</h1></Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
