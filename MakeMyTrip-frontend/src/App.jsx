import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Destinations from "./components/Destinations";
import Hotels from "./components/Hotels";
import Packages from "./components/Packages";
import Auth from "./components/Auth";
import Booking from "./components/Booking";
import MyBookings from "./components/MyBookings";

import AdminDashboard from "./components/AdminDashboard";

function AppContent() {
  const location = useLocation();
  const pageClass = location.pathname.startsWith("/destinations")
    ? "travel-destinations"
    : location.pathname.startsWith("/hotels")
      ? "travel-hotels"
      : location.pathname.startsWith("/packages")
        ? "travel-packages"
        : location.pathname.startsWith("/booking")
          ? "travel-booking"
          : location.pathname.startsWith("/my-bookings")
            ? "travel-my-bookings"
            : location.pathname.startsWith("/account") || location.pathname.startsWith("/login") || location.pathname.startsWith("/register")
              ? "auth-page"
              : location.pathname.startsWith("/admin")
                ? "admin-page"
                : "home-page";

  return (
    <>
      {!location.pathname.startsWith("/admin") && <Navbar />}

      <main className={`page-surface ${pageClass}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<Packages />} />
          <Route path="/account" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;