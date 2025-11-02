import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Filter, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

export default function PaymentManagement({ payments = [], bookings = [], customers = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filter, setFilter] = useState({ term: '', status: 'all', dates: { start: '', end: '' } });

  const handleSearch = () => {
    setFilter({ term: searchTerm, status: statusFilter, dates: dateRange });
  };

  // Get customer and booking details for each payment
  const paymentDetails = useMemo(() => {
    return payments.map(payment => {
      const booking = bookings.find(b => b.BookingID === payment.BookingID) || {};
      const customer = customers.find(c => c.CustomerID === booking.CustomerID) || {};
      
      return {
        ...payment,
        customerName: customer.Name || 'Unknown',
        roomId: booking.RoomID || 'N/A',
        checkInDate: booking.CheckInDate || 'N/A',
        checkOutDate: booking.CheckOutDate || 'N/A',
      };
    });
  }, [payments, bookings, customers]);

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    return paymentDetails.filter(payment => {
      const matchesSearch = 
        payment.customerName.toLowerCase().includes(filter.term.toLowerCase()) ||
        payment.PaymentID.toString().includes(filter.term) ||
        payment.BookingID.toString().includes(filter.term);
      
      const matchesStatus = filter.status === 'all' || payment.Status === filter.status;
      
      const matchesDate = !filter.dates.start || !filter.dates.end || 
        (payment.PaymentDate >= filter.dates.start && payment.PaymentDate <= filter.dates.end);
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [paymentDetails, filter]);

  const handleExport = () => {
    // In a real app, this would generate and download a CSV or Excel file
    alert('Exporting payment data...');
  };

  const handlePrint = (payment) => {
    // In a real app, this would open a print dialog with a receipt template
    alert(`Printing receipt for Payment #${payment.PaymentID}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all payment transactions
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="md:col-span-2">
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="w-full"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Failed', label: 'Failed' },
              { value: 'Refunded', label: 'Refunded' },
            ]}
            className="w-full"
          />
          <div className="flex space-x-2">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              placeholder="Start Date"
              className="w-full"
            />
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              placeholder="End Date"
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} variant="primary" className="w-full md:w-auto">
              Search
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.PaymentID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{payment.PaymentID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{payment.BookingID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(payment.PaymentDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${payment.PaymentMethod === 'Credit Card' ? 'bg-green-100 text-green-800' : 
                          payment.PaymentMethod === 'UPI' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {payment.PaymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {formatCurrency(payment.Amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handlePrint(payment)}
                        >
                          Receipt
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No payments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                  Total:
                </td>
                <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(
                    filteredPayments.reduce((sum, payment) => sum + parseFloat(payment.Amount || 0), 0)
                  )}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
