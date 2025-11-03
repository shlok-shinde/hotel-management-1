import { pool } from "../db/db.js";

export const getCustomers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Customer");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRooms = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Room");     
    res.json(rows);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Booking");       
    res.json(rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPayments = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Payment");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
