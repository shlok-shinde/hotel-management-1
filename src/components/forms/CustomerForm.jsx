import React, { useState, useEffect } from 'react';
import { Users, CalendarRange, User } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    DOB: '',
    Gender: '',
  });

  // Set initial form data if editing
  useEffect(() => {
    if (customer) {
      setFormData({
        Name: customer.Name || '',
        Email: customer.Email || '',
        Phone: customer.Phone || '',
        DOB: customer.DOB ? new Date(customer.DOB).toISOString().split('T')[0] : '',
        Gender: customer.Gender || '',
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <Input
          label="Full Name"
          id="Name"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          icon={Users}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            id="Email"
            name="Email"
            type="email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Phone Number"
            id="Phone"
            name="Phone"
            type="tel"
            value={formData.Phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Date of Birth"
            id="DOB"
            name="DOB"
            type="date"
            value={formData.DOB}
            onChange={handleChange}
            icon={CalendarRange}
            max={new Date().toISOString().split('T')[0]}
          />
          
          <Select
            label="Gender"
            id="Gender"
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
            icon={User}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
