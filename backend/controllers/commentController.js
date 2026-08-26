import { db } from "../db/index.js";

// Add a comment to a need
export async function addComment(req, res) {
  try {
    const { needId } = req.params;
    const { content } = req.body;
    const userId = req.user.user_id;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    // Check if the user is poster or claimant
    const [needs] = await db.query(
      `SELECT posted_by FROM needs WHERE need_id = ?`,
      [needId]
    );

    if (needs.length === 0) {
      return res.status(404).json({ error: "Need not found." });
    }

    const [claims] = await db.query(
      `SELECT volunteer_id FROM claims WHERE need_id = ? AND volunteer_id = ? AND status IN ('active', 'fulfilled')`,
      [needId, userId]
    );

    const isPoster = needs[0].posted_by === userId;
    const isClaimant = claims.length > 0;

    if (!isPoster && !isClaimant) {
      return res.status(403).json({ error: "Only the poster or claimant can add updates." });
    }

    await db.query(
      `INSERT INTO comments_on (need_id, user_id, content) VALUES (?, ?, ?)`,
      [needId, userId, content]
    );

    res.status(201).json({ message: "Comment added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add comment." });
  }
}

// Get comments for a need
export async function getComments(req, res) {
  try {
    const { needId } = req.params;

    const [comments] = await db.query(
      `SELECT c.comment_id, c.content, c.created_at, c.user_id, u.name 
       FROM comments_on c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.need_id = ?
       ORDER BY c.created_at ASC`,
      [needId]
    );

    res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch comments." });
  }
}
