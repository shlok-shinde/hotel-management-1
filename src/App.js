import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import BookingManagement from './pages/BookingManagement';
import CustomerManagement from './pages/CustomerManagement';
import RoomManagement from './pages/RoomManagement';
import PaymentManagement from './pages/PaymentManagement';
import Header from './components/layout/Header';

// Mock data
const MOCK_USERS = {
  "admin@hotel.com": { id: 1, name: "Admin User", email: "admin@hotel.com", password: "adminpassword", role: "admin" },
  "manager@hotel.com": { id: 2, name: "Manager User", email: "manager@hotel.com", password: "managerpassword", role: "manager" },
  "desk@hotel.com": { id: 3, name: "Front Desk User", email: "desk@hotel.com", password: "deskpassword", role: "front-desk" },
};

const MOCK_CUSTOMERS = [
  { CustomerID: 1, Name: "Alice Smith", Email: "alice@example.com", Phone: "555-0101", DOB: "1990-05-15", Gender: "Female" },
  { CustomerID: 2, Name: "Bob Johnson", Email: "bob@example.com", Phone: "555-0102", DOB: "1985-08-22", Gender: "Male" },
  { CustomerID: 3, Name: "Charlie Brown", Email: "charlie@example.com", Phone: "555-0103", DOB: "1992-11-30", Gender: "Male" },
];

const MOCK_ROOMS = [
  { RoomID: 101, RoomNumber: "101", Capacity: 2, RoomType: "Standard", PricePerNight: 12000, Status: "Available" },
  { RoomID: 102, RoomNumber: "102", Capacity: 2, RoomType: "Standard", PricePerNight: 12000, Status: "Occupied" },
  { RoomID: 201, RoomNumber: "201", Capacity: 4, RoomType: "Suite", PricePerNight: 20000, Status: "Available" },
  { RoomID: 202, RoomNumber: "202", Capacity: 3, RoomType: "Deluxe", PricePerNight: 16000, Status: "Cleaning" },
  { RoomID: 301, RoomNumber: "301", Capacity: 1, RoomType: "Single", PricePerNight: 8000, Status: "Maintenance" },
  { RoomID: 302, RoomNumber: "302", Capacity: 4, RoomType: "Family Suite", PricePerNight: 24000, Status: "Available" },
];

const MOCK_BOOKINGS = [
  { BookingID: 1001, CustomerID: 1, RoomID: 102, CheckInDate: "2025-10-26", CheckOutDate: "2025-10-28", BookingDate: "2025-10-20", Status: "Checked-In" },
  { BookingID: 1002, CustomerID: 2, RoomID: 201, CheckInDate: "2025-10-27", CheckOutDate: "2025-10-30", BookingDate: "2025-10-22", Status: "Confirmed" },
  { BookingID: 1003, CustomerID: 3, RoomID: 302, CheckInDate: "2025-11-01", CheckOutDate: "2025-11-05", BookingDate: "2025-10-25", Status: "Confirmed" },
];

const MOCK_PAYMENTS = [
  { PaymentID: 5001, BookingID: 1001, PaymentDate: "2025-10-20", Amount: 24000.00, PaymentMethod: "Credit Card" },
  { PaymentID: 5002, BookingID: 1002, PaymentDate: "2025-10-22", Amount: 60000.00, PaymentMethod: "UPI" },
  { PaymentID: 5003, BookingID: 1003, PaymentDate: "2025-10-25", Amount: 96000.00, PaymentMethod: "Credit Card" },
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  const handleLogin = (email, password) => {
    const user = MOCK_USERS[email];
    if (user && user.password === password) {
      setCurrentUser(user);
      return null; // Success
    }
    return "Invalid email or password"; // Error
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSaveBooking = (bookingData) => {
    if (bookingData.BookingID) {
      // Update existing booking
      setBookings(bookings.map(b => 
        b.BookingID === bookingData.BookingID ? { ...b, ...bookingData } : b
      ));
    } else {
      // Create new booking
      const newBookingID = Math.max(...bookings.map(b => b.BookingID)) + 1;
      const newBooking = {
        ...bookingData,
        BookingID: newBookingID,
        BookingDate: new Date().toISOString().split('T')[0],
      };
      setBookings([...bookings, newBooking]);
    }
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings(bookings.filter(b => b.BookingID !== bookingId));
    }
  };

  const handleSaveCustomer = (customerData) => {
    if (customerData.CustomerID) {
      // Update existing customer
      setCustomers(customers.map(c => 
        c.CustomerID === customerData.CustomerID ? { ...c, ...customerData } : c
      ));
    } else {
      // Create new customer
      const newCustomerID = Math.max(...customers.map(c => c.CustomerID)) + 1;
      setCustomers([...customers, { ...customerData, CustomerID: newCustomerID }]);
    }
  };

  const handleUpdateRoomStatus = (roomId, newStatus) => {
    setRooms(rooms.map(room => 
      room.RoomID === roomId ? { ...room, Status: newStatus } : room
    ));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {currentUser ? (
          <div className="flex flex-col min-h-screen">
            <Header 
              user={currentUser} 
              onLogout={handleLogout} 
            />
            <main className="flex-grow p-6">
              <Routes>
                <Route path="/" element={
                  <Dashboard 
                    bookings={bookings}
                    rooms={rooms}
                    customers={customers}
                  />
                } />
                <Route path="/bookings" element={
                  <BookingManagement 
                    bookings={bookings}
                    customers={customers}
                    rooms={rooms}
                    onEdit={(booking) => console.log('Edit booking', booking)}
                    onDelete={handleDeleteBooking}
                    onAdd={() => console.log('Add new booking')}
                    user={currentUser}
                  />
                } />
                <Route path="/customers" element={
                  <CustomerManagement 
                    customers={customers}
                    onEdit={(customer) => console.log('Edit customer', customer)}
                    onAdd={() => console.log('Add new customer')}
                    user={currentUser}
                  />
                } />
                <Route path="/rooms" element={
                  <RoomManagement 
                    rooms={rooms}
                    onStatusChange={handleUpdateRoomStatus}
                    user={currentUser}
                  />
                } />
                <Route path="/payments" element={
                  <PaymentManagement 
                    payments={payments}
                    bookings={bookings}
                    customers={customers}
                  />
                } />
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
