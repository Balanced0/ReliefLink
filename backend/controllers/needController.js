import { db } from "../db/index.js";

// Feature 1: Need Posting System
export async function createNeed(req, res) {
  try {
    const { category, area_id, urgency, description, quantity } = req.body;

    if (!category || !area_id || !description) {
      return res
        .status(400)
        .json({ error: "Category, area, and description are required." });
    }

    const [result] = await db.query(
      `INSERT INTO needs (category, area_id, urgency, description, quantity, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        category,
        area_id,
        urgency || "medium",
        description,
        quantity || null,
        req.user.user_id,
      ],
    );

    res.status(201).json({
      message: "Need created successfully.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Could not create the need. Please try again." });
  }
}
