import { db } from "../db/index.js";

export async function getAreas(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM areas ORDER BY area_name");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load areas." });
  }
}