import { db } from "../db/index.js";

export async function addBookmark(req, res) {
  try {
    const { area_id } = req.body;
    if (!area_id) {
      return res.status(400).json({ error: "area_id is required." });
    }

    await db.query(
      `INSERT IGNORE INTO bookmarks (user_id, area_id) VALUES (?, ?)`,
      [req.user.user_id, area_id],
    );

    res.status(201).json({ message: "Bookmark added." });
  }
  catch (err) {
    res.status(500).json({ error: "Could not add bookmark." });
  }
}

export async function removeBookmark(req, res) {
  try {
    const { area_id } = req.params;

    const [result] = await db.query(
      `DELETE FROM bookmarks WHERE user_id = ? AND area_id = ?`,
      [req.user.user_id, area_id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Bookmark not found." });
    }

    res.json({ message: "Bookmark removed." });
  }
  catch (err) {
    res.status(500).json({ error: "Could not remove bookmark." });
  }
}

export async function getBookmarks(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT a.*, b.created_at AS bookmarked_at
       FROM bookmarks b
       JOIN areas a ON b.area_id = a.area_id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.user_id],
    );

    res.json(rows);
  }
  catch (err) {
    res.status(500).json({ error: "Could not load bookmarks." });
  }
}
