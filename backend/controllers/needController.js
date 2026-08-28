import { db } from "../db/index.js";

const VALID_CATEGORIES = ["food", "medicine", "shelter", "rescue", "other"];
// Feature 1: Need Posting System
export async function createNeed(req, res) {
  try {
    const { categories, area_id, urgency, description, quantity } = req.body;

    if (!categories || categories.length === 0 || !area_id || !description) {
      return res.status(400).json({
        error:
          "At least one category, an area, and a description are required.",
      });
    }

    for (const category of categories) {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: `Invalid category: ${category}` });
      }
    }

    const [result] = await db.query(
      `INSERT INTO needs (area_id, urgency, description, quantity, posted_by)
       VALUES (?, ?, ?, ?, ?)`,
      [
        area_id,
        urgency || "medium",
        description,
        quantity || null,
        req.user.user_id,
      ],
    );

    const need_id = result.insertId;

    for (const category of categories) {
      await db.query(
        "INSERT INTO need_categories (need_id, category) VALUES (?, ?)",
        [need_id, category],
      );
    }

    res.status(201).json({
      message: "Need created successfully.",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not create the need. Please try again." });
  }
}

export async function getNeedById(req, res) {
  try {
    const [needs] = await db.query(
      `SELECT needs.*, areas.area_name, users.name AS poster_name
       FROM needs
       JOIN areas ON needs.area_id = areas.area_id
       JOIN users ON needs.posted_by = users.user_id
       WHERE needs.need_id = ?`,
      [req.params.id],
    );

    if (needs.length === 0) {
      return res.status(404).json({ error: "Need not found." });
    }

    const [categoryRows] = await db.query(
      "SELECT category FROM need_categories WHERE need_id = ?",
      [req.params.id],
    );

    const need = needs[0];
    need.categories = categoryRows.map((row) => row.category);

    res.json(need);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load this need." });
  }
}
