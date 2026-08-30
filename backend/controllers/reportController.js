import { db } from "../db/index.js";

const HIDE_THRESHOLD = 3;

export async function createReport(req, res) {
  try {
    const need_id = req.params.need_id;
    const reported_by = req.user.user_id;
    const reason = req.body.reason || null;

    const [result] = await db.query(
      `INSERT IGNORE INTO reports (need_id, reported_by, reason)
       VALUES (?, ?, ?)`,
      [need_id, reported_by, reason],
    );

    if (result.affectedRows === 0) {
      return res
        .status(409)
        .json({ message: "You have already reported this need." });
    }

    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM reports
       WHERE need_id = ? AND resolved = FALSE`,
      [need_id],
    );

    if (count >= HIDE_THRESHOLD) {
      await db.query(
        `UPDATE needs SET is_hidden = TRUE WHERE need_id = ?`,
        [need_id],
      );
    }

    res.status(201).json({ message: "Report submitted successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not submit the report. Please try again." });
  }
}


export async function getReportsForNeed(req, res) {
  try {
    const [reports] = await db.query(
      `SELECT reports.*, users.name AS reporter_name
       FROM reports
       JOIN users ON reports.reported_by = users.user_id
       WHERE reports.need_id = ?
       ORDER BY reports.created_at DESC`,
      [req.params.need_id],
    );

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load reports." });
  }
}
