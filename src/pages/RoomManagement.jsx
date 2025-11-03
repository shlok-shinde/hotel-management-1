import React, { useState, useMemo } from 'react';
import { Search, Plus, Bed, Wrench, CheckCheck, X, Home } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const RoomManagement = ({ 
  rooms = [], 
  onStatusChange = () => {}, 
  user = {} 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [filter, setFilter] = useState({ term: '', status: 'All', type: 'All' });

  const handleSearch = () => {
    setFilter({ term: searchTerm, status: statusFilter, type: typeFilter });
  };

  // Available room types
  const roomTypes = ['All', ...new Set(rooms.map(room => room.RoomType))];
  
  // Room status options
  const statuses = ['All', 'Available', 'Occupied', 'Cleaning', 'Maintenance'];

  // Filter rooms based on search and filters
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.RoomNumber.toLowerCase().includes(filter.term.toLowerCase()) ||
                         room.RoomType.toLowerCase().includes(filter.term.toLowerCase());
      
      const matchesStatus = filter.status === 'All' || room.Status === filter.status;
      const matchesType = filter.type === 'All' || room.RoomType === filter.type;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, filter]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Occupied':
        return 'bg-red-100 text-red-800';
      case 'Cleaning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return <CheckCheck className="h-4 w-4" />;
      case 'Occupied':
        return <X className="h-4 w-4" />;
      case 'Cleaning':
        return <Wrench className="h-4 w-4" />;
      case 'Maintenance':
        return <Wrench className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  // Get next status for toggle
  const getNextStatus = (currentStatus) => {
    const statusOrder = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder[(currentIndex + 1) % statusOrder.length];
  };

  // Handle status change
  const handleStatusChange = (roomId, currentStatus) => {
    const newStatus = getNextStatus(currentStatus);
    onStatusChange(roomId, newStatus);
  };

  // Calculate room statistics
  const roomStats = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(room => room.Status === 'Available').length;
    const occupiedRooms = rooms.filter(room => room.Status === 'Occupied').length;
    const cleaningRooms = rooms.filter(room => room.Status === 'Cleaning').length;
    const maintenanceRooms = rooms.filter(room => room.Status === 'Maintenance').length;
    
    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRooms,
      maintenanceRooms,
      occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
    };
  }, [rooms]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Room Management</h2>
        <Button variant="primary" icon={Plus}>
          Add Room
        </Button>
      </div>

      {/* Room Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Home className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Rooms</p>
              <p className="text-2xl font-bold">{roomStats.totalRooms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-bold">{roomStats.availableRooms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <X className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Occupied</p>
              <p className="text-2xl font-bold">{roomStats.occupiedRooms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Wrench className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cleaning</p>
              <p className="text-2xl font-bold">{roomStats.cleaningRooms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 text-gray-600">
              <Wrench className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Maintenance</p>
              <p className="text-2xl font-bold">{roomStats.maintenanceRooms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Input
              label="Search Rooms"
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by room number or type..."
              icon={Search}
            />
          </div>
          <div>
            <Select
              label="Filter by Status"
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
          <div>
            <Select
              label="Filter by Type"
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {roomTypes.map(type => (
                <option key={type} value={type}>
                  {type}
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

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <Card key={room.RoomID} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Room {room.RoomNumber}</h3>
                    <p className="text-sm text-gray-500">{room.RoomType}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.Status)}`}>
                    {getStatusIcon(room.Status)}
                    <span className="ml-1">{room.Status}</span>
                  </span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Capacity:</span>
                    <span className="font-medium">{room.Capacity} {room.Capacity === 1 ? 'person' : 'people'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium">₹{room.PricePerNight.toLocaleString()}/night</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Floor:</span>
                    <span className="font-medium">{Math.floor(room.RoomNumber / 100) || 'G'}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center"
                    onClick={() => handleStatusChange(room.RoomID, room.Status)}
                  >
                    Mark as {getNextStatus(room.Status)}
                  </Button>
                </div>
              </div>
              
              {room.Status === 'Occupied' && (
                <div className="bg-yellow-50 px-6 py-3 border-t border-yellow-100">
                  <div className="text-sm text-yellow-800">
                    <p>Occupied by: Guest Name</p>
                    <p className="text-xs">Check-out: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              
              {room.Status === 'Maintenance' && (
                <div className="bg-red-50 px-6 py-3 border-t border-red-100">
                  <div className="text-sm text-red-800">
                    <p>Under maintenance</p>
                    <p className="text-xs">Reported: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Bed className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'All' || typeFilter !== 'All' 
                ? 'Try adjusting your search or filter to find what you\'re looking for.' 
                : 'No rooms have been added yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;
