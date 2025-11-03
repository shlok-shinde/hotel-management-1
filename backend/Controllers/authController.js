import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../db/db.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Fetch user from database
    const [rows] = await pool.query(
      "SELECT * FROM Customer WHERE Email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    let isMatch = false;
    // Compare passwords
    if(password == user.CustomerPassword){
        isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user.CustomerID, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.CustomerID,
        name: user.CustomerName,
        email: user.Email,
      },
    });

    console.log(`User ${email} logged in successfully.`);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
