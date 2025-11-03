import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/db.js';
import { authRoutes } from './Routes/authRoutes.js';
import { getdataRoutes } from './Routes/getdataRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Auth routes
app.use('/auth', authRoutes);

// Data Routes
app.use('/data', getdataRoutes);

(async () => {
  try {
    await pool.query("SELECT 1"); // Test connection
    console.log("✅ Connected to MySQL");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();
