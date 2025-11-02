import React, { useState, useEffect } from 'react';
import { CalendarRange, Users, BedDouble, FileText } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { calculateNights } from '../../utils/helpers';

const BookingForm = ({ 
  booking, 
  customers = [], 
  rooms = [], 
  onSave, 
  onCancel,
  user 
}) => {
  const [formData, setFormData] = useState({
    CustomerID: '',
    RoomID: '',
    CheckInDate: '',
    CheckOutDate: '',
    Status: 'Confirmed',
    totalAmount: 0,
    totalNights: 0
  });

  // Set initial form data if editing
  useEffect(() => {
    if (booking) {
      setFormData({
        ...booking,
        CheckInDate: booking.CheckInDate || '',
        CheckOutDate: booking.CheckOutDate || '',
        totalNights: booking.CheckInDate && booking.CheckOutDate 
          ? calculateNights(booking.CheckInDate, booking.CheckOutDate) 
          : 0
      });
    }
  }, [booking]);

  // Calculate total nights and amount when dates or room changes
  useEffect(() => {
    if (formData.CheckInDate && formData.CheckOutDate) {
      const nights = calculateNights(formData.CheckInDate, formData.CheckOutDate);
      const selectedRoom = rooms.find(r => r.RoomID == formData.RoomID);
      const amount = selectedRoom ? selectedRoom.PricePerNight * nights : 0;
      
      setFormData(prev => ({
        ...prev,
        totalNights: nights,
        totalAmount: amount
      }));
    }
  }, [formData.CheckInDate, formData.CheckOutDate, formData.RoomID, rooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      RoomID: parseInt(formData.RoomID),
      CustomerID: parseInt(formData.CustomerID),
      // Convert dates to ISO string and remove time part
      CheckInDate: formData.CheckInDate,
      CheckOutDate: formData.CheckOutDate,
    });
  };

  // Filter available rooms
  const availableRooms = rooms.filter(room => 
    room.Status === 'Available' || 
    (booking && room.RoomID === booking.RoomID)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Customer"
          id="CustomerID"
          name="CustomerID"
          value={formData.CustomerID}
          onChange={handleChange}
          icon={Users}
          required
        >
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer.CustomerID} value={customer.CustomerID}>
              {customer.Name} ({customer.Email})
            </option>
          ))}
        </Select>

        <Select
          label="Room"
          id="RoomID"
          name="RoomID"
          value={formData.RoomID}
          onChange={handleChange}
          icon={BedDouble}
          required
        >
          <option value="">Select Room</option>
          {availableRooms.map(room => (
            <option key={room.RoomID} value={room.RoomID}>
              {room.RoomNumber} - {room.RoomType} (₹{room.PricePerNight}/night)
            </option>
          ))}
        </Select>

        <Input
          label="Check-in Date"
          id="CheckInDate"
          name="CheckInDate"
          type="date"
          value={formData.CheckInDate}
          onChange={handleChange}
          icon={CalendarRange}
          required
          min={new Date().toISOString().split('T')[0]}
        />

        <Input
          label="Check-out Date"
          id="CheckOutDate"
          name="CheckOutDate"
          type="date"
          value={formData.CheckOutDate}
          onChange={handleChange}
          icon={CalendarRange}
          required
          min={formData.CheckInDate || new Date().toISOString().split('T')[0]}
        />

        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Nights</p>
              <p className="text-lg font-semibold">{formData.totalNights}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-lg font-semibold">₹{formData.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <Select
          label="Booking Status"
          id="Status"
          name="Status"
          value={formData.Status}
          onChange={handleChange}
          icon={FileText}
          required
          disabled={user?.role === 'front-desk' && !!booking}
        >
          <option value="Confirmed">Confirmed</option>
          <option value="Checked-In">Checked-In</option>
          {user?.role !== 'front-desk' && (
            <>
              <option value="Checked-Out">Checked-Out</option>
              <option value="Cancelled">Cancelled</option>
            </>
          )}
        </Select>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {booking ? 'Save Changes' : 'Create Booking'}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
