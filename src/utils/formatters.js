/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'INR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @param {string} format - The format string (default: 'dd MMM yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'dd MMM yyyy') => {
  if (!dateString) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(new Date(dateString));
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a duration in days
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} Formatted duration (e.g., "2 nights, 3 days")
 */
export const formatDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 'N/A';
  }
};

/**
 * Format a name with proper capitalization
 * @param {string} name - The name to format
 * @returns {string} Formatted name
 */
export const formatName = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
