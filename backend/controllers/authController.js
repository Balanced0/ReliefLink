import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "@/backend/db/index";

const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (role !== "affected" && role !== "volunteer") {
      return res
        .status(400)
        .json({ error: "Role must be 'affected' or 'volunteer'." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, password_hash, role],
    );

    const token = jwt.sign(
      { user_id: result.insertId, role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "That email is already registered." });
    }
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
