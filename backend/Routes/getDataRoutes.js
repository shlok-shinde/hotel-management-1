import { Router } from "express";
import { getCustomers, getRooms, getBookings, getPayments } from "../Controllers/getDataController.js";

const getdataRoutes = Router();

getdataRoutes.get('/customers', getCustomers);
getdataRoutes.get('/rooms', getRooms);
getdataRoutes.get('/bookings', getBookings);
getdataRoutes.get('/payments', getPayments);    

export { getdataRoutes };