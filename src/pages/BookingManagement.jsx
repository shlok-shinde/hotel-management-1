import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, User } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const BookingManagement = ({ 
  bookings = [], 
  customers = [], 
  rooms = [], 
  onEdit = () => {}, 
  onDelete = () => {}, 
  onAdd = () => {}, 
  user = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('Guest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filter, setFilter] = useState({ term: '', type: 'Guest', status: 'All' });

  const handleSearch = () => {
    setFilter({ term: searchTerm, type: searchType, status: statusFilter });
  };

  // Create maps for customer and room lookups
  const customerMap = useMemo(() => 
    customers.reduce((acc, customer) => {
      acc[customer.CustomerID] = customer;
      return acc;
    }, {}), [customers]);
  
  const roomMap = useMemo(() =>
    rooms.reduce((acc, room) => {
      acc[room.RoomID] = room;
      return acc;
    }, {}), [rooms]);

  // Get unique statuses for filter
  const statuses = ['All', ...new Set(bookings.map(b => b.Status))];

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const customer = customerMap[booking.CustomerID] || {};
      const room = roomMap[booking.RoomID] || {};
      const searchLower = filter.term.toLowerCase();
      
      // Apply status filter
      if (filter.status !== 'All' && booking.Status !== filter.status) {
        return false;
      }
      
      // Apply search
      if (filter.term) {
        switch (filter.type) {
          case 'Guest':
            return customer.Name?.toLowerCase().includes(searchLower) || 
                   customer.Email?.toLowerCase().includes(searchLower);
          case 'Room':
            return room.RoomNumber?.toLowerCase().includes(searchLower);
          case 'Booking ID':
            return String(booking.BookingID).includes(searchLower);
          case 'Status':
            return booking.Status.toLowerCase().includes(searchLower);
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [bookings, customerMap, roomMap, filter]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return filteredBookings.reduce((total, booking) => {
      const room = roomMap[booking.RoomID];
      if (room && booking.Status !== 'Cancelled') {
        const nights = Math.ceil(
          (new Date(booking.CheckOutDate) - new Date(booking.CheckInDate)) / (1000 * 60 * 60 * 24)
        );
        return total + (room.PricePerNight * nights);
      }
      return total;
    }, 0);
  }, [filteredBookings, roomMap]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Booking Management</h2>
        <Button onClick={onAdd} variant="primary" icon={Plus}>
          New Booking
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{filteredBookings.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active Stays</p>
          <p className="text-2xl font-bold">
            {filteredBookings.filter(b => b.Status === 'Checked-In').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Search"
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search by ${searchType.toLowerCase()}...`}
              icon={Search}
            />
          </div>
          <div>
            <Select
              label="Search By"
              id="search-type"
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchTerm('');
              }}
            >
              <option value="Guest">Guest</option>
              <option value="Room">Room</option>
              <option value="Booking ID">Booking ID</option>
              <option value="Status">Status</option>
            </Select>
          </div>
          <div>
            <Select
              label="Status Filter"
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} variant="primary" className="w-full md:w-auto">
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => {
                  const customer = customerMap[booking.CustomerID] || {};
                  const room = roomMap[booking.RoomID] || {};
                  const nights = Math.ceil(
                    (new Date(booking.CheckOutDate) - new Date(booking.CheckInDate)) / (1000 * 60 * 60 * 24)
                  );
                  const total = room.PricePerNight ? room.PricePerNight * nights : 0;
                  
                  return (
                    <tr key={booking.BookingID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.BookingID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.Name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{customer.Email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {room.RoomNumber ? `Room ${room.RoomNumber}` : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{room.RoomType || ''}</div>
                        <div className="text-sm text-gray-500">
                          ₹{room.PricePerNight ? room.PricePerNight.toLocaleString() : '0'}/night
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.CheckInDate)} - {formatDate(booking.CheckOutDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {nights} {nights === 1 ? 'night' : 'nights'}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.Status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${booking.Status === 'Checked-In' ? 'bg-green-100 text-green-800' : ''}
                          ${booking.Status === 'Checked-Out' ? 'bg-gray-100 text-gray-800' : ''}
                          ${booking.Status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {booking.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => onEdit(booking)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit booking"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          {user.role !== 'front-desk' && (
                            <button
                              onClick={() => onDelete(booking.BookingID)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete booking"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No bookings found. Create a new booking to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BookingManagement;
