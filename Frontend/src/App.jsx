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
import AdminAadhaarCheck from "./Components/Addhar/AdminAddhar.jsx";
import FarmerAadhaarCheck from "./Components/Addhar/FarmerAddhar.jsx";
import GovtAadhaarCheck from "./Components/Addhar/GovtAddhar.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>

      {/* ================= ADDHAR ================= */}
      <Route
        path="/admin-aadhar"
        element={<AdminAadhaarCheck />}
      />

      {/* ================= LANDING PAGE ================= */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* ================= LOGIN ================= */}
      <Route
        path="/farmer-login"
        element={<Login_Farmer />}
      />

      <Route
        path="/admin-login"
        element={<Login_Admin />}
      />

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
        element={
          <ProtectedRoute role="admin">
            <Admin_Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Farmer Dashboard */}
      <Route
        path="/farmer-dashboard"
        element={
          <ProtectedRoute role="farmer">
            <Farmer_Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Government Dashboard */}
      <Route
        path="/government-dashboard"
        element={
          <ProtectedRoute role="govt">
            <Govt_Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= BOOKING ================= */}

      <Route
        path="/booking"
        element={<Booking />}
      />


      {/* ================= ADDHAR ================= */}

    <Route
      path="/admin-aadhar"
      element={<AdminAadhaarCheck />} 
    />

    <Route
      path="/farmer-aadhar"
      element={<FarmerAadhaarCheck />} 
    />

    <Route
      path="/government-aadhar"
      element={<GovtAadhaarCheck />} 
    />

    </Routes>
  );
}

export default App;

