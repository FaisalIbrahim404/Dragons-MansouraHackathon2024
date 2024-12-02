import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Map from "./pages/Map";
import { getCookie } from "./utils/cookies";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getCookie("session_token");
    const currentPath = location.pathname;

    if (!token && currentPath !== "/login" && currentPath !== "/signup") {
      navigate("/login");
    }
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Map />} />
    </Routes>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
