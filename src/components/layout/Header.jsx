import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, BedDouble, LayoutDashboard, CalendarRange, Users, DollarSign } from 'lucide-react';
import Button from '../common/Button';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: CalendarRange },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  // Filter nav items based on user role
  const allowedNavItems = navItems.filter(item => {
    if (item.id === 'payments' && user?.role === 'front-desk') {
      return false;
    }
    return true;
  });


  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <BedDouble className="h-10 w-10 text-blue-600" />
            <span className="ml-3 text-2xl font-bold text-gray-900">Hotelier Admin Panel</span>
          </div>
          
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="block text-sm font-medium text-gray-900">{user.name}</span>
                <span className="block text-xs font-medium text-gray-500 capitalize">
                  {user.role?.replace('-', ' ')}
                </span>
              </div>
              <Button onClick={onLogout} variant="ghost" className="px-2 py-1">
                <LogOut className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          )}
        </div>
        
        {user && (
          <div className="flex items-center space-x-2 pb-3">
            {allowedNavItems.map(item => {
              const isActive = location.pathname === `/${item.id}` || 
                             (location.pathname === '/' && item.id === 'dashboard');
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  onClick={() => navigate(`/${item.id}`)}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="font-medium px-3 py-2 rounded-md text-sm transition-colors flex items-center"
                >
                  <Icon className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
