import React, { useState, useMemo } from 'react';
import { Search, UserPlus, Edit, User, Phone, Mail, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const CustomerManagement = ({ customers = [], onEdit, onAdd, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('Name');
  const [filter, setFilter] = useState({ term: '', type: 'Name' });

  const handleSearch = () => {
    setFilter({ term: searchTerm, type: searchType });
  };

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!filter.term) return customers;
    
    const searchLower = filter.term.toLowerCase();
    
    return customers.filter(customer => {
      if (!customer) return false;
      
      switch (filter.type) {
        case 'Name':
          return customer.Name?.toLowerCase().includes(searchLower) || false;
        case 'Email':
          return customer.Email?.toLowerCase().includes(searchLower) || false;
        case 'Phone':
          return customer.Phone?.includes(filter.term) || false;
        case 'ID':
          return String(customer.CustomerID || '').includes(filter.term);
        default:
          return true;
      }
    });
  }, [customers, filter]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Customer Management</h2>
        <Button onClick={onAdd} variant="primary" icon={UserPlus}>
          New Customer
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active Guests</p>
          <p className="text-2xl font-bold">
            {customers.filter(c => c?.Status === 'Active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm font-medium text-gray-500">New This Month</p>
          <p className="text-2xl font-bold">
            {customers.filter(c => {
              try {
                const customerDate = new Date(c?.CreatedAt || c?.JoinedDate || new Date());
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                return customerDate >= oneMonthAgo;
              } catch (e) {
                return false;
              }
            }).length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <option value="Name">Name</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="ID">Customer ID</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} variant="primary" className="w-full md:w-auto">
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
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
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  customer && (
                    <tr key={customer.CustomerID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.Name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">ID: {customer.CustomerID || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                          {customer.Email || 'N/A'}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Phone className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                          {customer.Phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.Gender || 'Not specified'}
                        </div>
                        <div className="text-sm text-gray-500">
                          <CalendarIcon className="inline-block h-4 w-4 mr-1" />
                          {customer.DOB ? `${formatDate(customer.DOB)} (${calculateAge(customer.DOB)} yrs)` : 'DOB: N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => onEdit && onEdit(customer)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit customer"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search or filter to find what you\'re looking for.' : 'Get started by creating a new customer.'}
                    </p>
                    <div className="mt-6">
                      <Button
                        onClick={onAdd}
                        variant="primary"
                        icon={UserPlus}
                        className="inline-flex items-center"
                      >
                        New Customer
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredCustomers.length > 10 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">
                    {Math.min(10, filteredCustomers.length)}</span> of{' '}
                  <span className="font-medium">{filteredCustomers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerManagement;
