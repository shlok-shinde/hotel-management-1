import React from 'react';
import { Users, CalendarRange, BedDouble } from 'lucide-react';
import Card from '../components/common/Card';

const DashboardStatCard = ({ title, value, icon: Icon, color, onClick, cta }) => (
  <Card className="flex flex-col h-full">
    <div className="p-6 flex-grow">
      <div className={`p-3 inline-block rounded-full ${color.bg} mb-4`}>
        <Icon className={`h-8 w-8 ${color.text}`} />
      </div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="p-4 bg-gray-50 border-t">
      <button
        onClick={onClick}
        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
      >
        {cta}
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </Card>
);

const Dashboard = ({ bookings = [], rooms = [], customers = [], onNavigate = () => {} }) => {
  const stats = {
    activeBookings: bookings.filter(b => b.Status === 'Checked-In').length,
    pendingCheckIns: bookings.filter(b => 
      b.Status === 'Confirmed' && 
      new Date(b.CheckInDate).toDateString() === new Date().toDateString()
    ).length,
    availableRooms: rooms.filter(r => r.Status === 'Available').length,
    totalGuests: customers.length,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard
          title="Active Bookings"
          value={stats.activeBookings}
          icon={CalendarRange}
          color={{ bg: 'bg-green-100', text: 'text-green-600' }}
          onClick={() => onNavigate('bookings')}
          cta="View Bookings"
        />
        
        <DashboardStatCard
          title="Today's Check-Ins"
          value={stats.pendingCheckIns}
          icon={Users}
          color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
          onClick={() => onNavigate('bookings')}
          cta="View Check-Ins"
        />
        
        <DashboardStatCard
          title="Available Rooms"
          value={stats.availableRooms}
          icon={BedDouble}
          color={{ bg: 'bg-yellow-100', text: 'text-yellow-600' }}
          onClick={() => onNavigate('rooms')}
          cta="View Rooms"
        />
        
        <DashboardStatCard
          title="Total Guests"
          value={stats.totalGuests}
          icon={Users}
          color={{ bg: 'bg-purple-100', text: 'text-purple-600' }}
          onClick={() => onNavigate('customers')}
          cta="View Customers"
        />
      </div>
      
      {/* Recent Activity Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h3>
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => {
                  const customer = customers.find(c => c.CustomerID === booking.CustomerID);
                  const room = rooms.find(r => r.RoomID === booking.RoomID);
                  
                  return (
                    <tr key={booking.BookingID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.BookingID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer?.Name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {room ? `Room ${room.RoomNumber}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.CheckInDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.CheckOutDate).toLocaleDateString()}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {bookings.length > 5 && (
            <div className="px-6 py-3 bg-gray-50 text-right border-t">
              <button 
                onClick={() => onNavigate('bookings')}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all bookings →
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
