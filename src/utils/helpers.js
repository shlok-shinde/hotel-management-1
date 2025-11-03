export const calculateNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.abs(end - start);
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights;
};