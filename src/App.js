import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookingManagement from "./pages/BookingManagement";
import CustomerManagement from "./pages/CustomerManagement";
import RoomManagement from "./pages/RoomManagement";
import PaymentManagement from "./pages/PaymentManagement";
import Header from "./components/layout/Header";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    // This gets called from LoginPage after successful login
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {currentUser ? (
          <div className="flex flex-col min-h-screen">
            <Header user={currentUser} onLogout={handleLogout} />
            <main className="flex-grow p-6">
              <Routes>
                <Route path="/" element={<Dashboard user={currentUser} />} />
                <Route path="/bookings" element={<BookingManagement user={currentUser} />} />
                <Route path="/customers" element={<CustomerManagement user={currentUser} />} />
                <Route path="/rooms" element={<RoomManagement user={currentUser} />} />
                <Route path="/payments" element={<PaymentManagement user={currentUser} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
