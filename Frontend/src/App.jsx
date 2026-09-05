import { Routes, Route } from "react-router-dom";

// Landing Page
import LandingPage from "./Components/LandingPage.jsx";

// Login Pages
import Login_Farmer from "./Components/Login/FarmerLogin.jsx";
import Login_Admin from "./Components/Login/AdminLogin.jsx";
import Login_Govt from "./Components/Login/GovtLogin.jsx";

// Registration Pages
import Register_Farmer from "./Components/Registration/FarmerRegistration.jsx";
import Register_Admin from "./Components/Registration/AdminRegistraion.jsx";
import Register_Govt from "./Components/Registration/GovtRegistration.jsx";

// Dashboard Pages
import Admin_Dashboard from "./Components/Dashboard/Admin_Dashboard.jsx";
import Farmer_Dashboard from "./Components/Dashboard/Farmer_Dashboard.jsx";
import Govt_Dashboard from "./Components/Dashboard/Govt_Dashboard.jsx";

// Booking
import Booking from "./Components/Booking/Booking.jsx";

function App() {
  return (
    <Routes>

      {/* ================= LANDING PAGE ================= */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* ================= LOGIN ================= */}

      {/* Farmer Login */}
      <Route
        path="/farmer-login"
        element={<Login_Farmer />}
      />

      {/* Admin Login */}
      <Route
        path="/admin-login"
        element={<Login_Admin />}
      />

      {/* Government Login */}
      <Route
        path="/government-login"
        element={<Login_Govt />}
      />

      {/* ================= REGISTRATION ================= */}

      {/* Farmer Registration */}
      <Route
        path="/farmer-register"
        element={<Register_Farmer />}
      />

      {/* Admin Registration */}
      <Route
        path="/admin-register"
        element={<Register_Admin />}
      />

      {/* Government Registration */}
      <Route
        path="/government-register"
        element={<Register_Govt />}
      />

      {/* ================= DASHBOARD ================= */}

      {/* Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={<Admin_Dashboard />}
      />

      {/* Farmer Dashboard */}
      <Route
        path="/farmer-dashboard"
        element={<Farmer_Dashboard />}
      />

      {/* Government Dashboard */}
      <Route
        path="/government-dashboard"
        element={<Govt_Dashboard />}
      />

      {/* ================= BOOKING ================= */}

      <Route
        path="/booking"
        element={<Booking />}
      />

    </Routes>
  );
}

export default App;

