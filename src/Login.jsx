import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { db } from "./firebaseConfig"; // Firestore configuration
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  // Redirect logged-in users away from login/signup pages
  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to the home page or dashboard
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Attempt to log in the user
      const userCredential = await login(email, password);
      const uid = userCredential.user.uid;

      // Step 2: Check if an entry exists in the admins collection
      const adminRef = doc(db, "admins", uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        // Step 3: Navigate to the home page if entry exists
        navigate("/");
      } else {
        // Step 4: Log the user out and display an error if entry doesn't exist
        await logout();
        setError("Access denied. You admin permissions have been revoked.");
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              id="password-input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              id="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
