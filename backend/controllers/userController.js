import { db } from "../db/index.js";

export async function getUserProfile(req, res) {
  try {
    const user_id = req.params.id;

    // Get basic user info
    const [users] = await db.query(
      "SELECT user_id, name, email, role, account_type, account_status, created_at FROM users WHERE user_id = ?",
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = users[0];

    // Get contribution history
    const [contributions] = await db.query(
      `SELECT lc.contribution_id, lc.fulfilled_at, n.need_id, n.category, n.description, a.area_name
       FROM logs_contribution lc
       JOIN needs n ON lc.need_id = n.need_id
       JOIN areas a ON n.area_id = a.area_id
       WHERE lc.volunteer_id = ?
       ORDER BY lc.fulfilled_at DESC`,
      [user_id]
    );

    // Get ratings
    const [ratings] = await db.query(
      `SELECT r.rating_id, r.stars, r.comment, u.name as rater_name
       FROM rates r
       JOIN users u ON r.rated_by = u.user_id
       WHERE r.rated_user_id = ?`,
      [user_id]
    );

    // Calculate average rating
    const [avgRatingResult] = await db.query(
      "SELECT AVG(stars) as average_rating FROM rates WHERE rated_user_id = ?",
      [user_id]
    );
    
    user.contributions = contributions;
    user.ratings = ratings;
    user.average_rating = avgRatingResult[0].average_rating ? parseFloat(avgRatingResult[0].average_rating).toFixed(1) : null;

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch user profile." });
  }
}

export async function rateUser(req, res) {
  try {
    const rated_user_id = req.params.id;
    const rated_by = req.user.user_id;
    const { stars, comment } = req.body;

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: "Stars must be between 1 and 5." });
    }

    if (rated_user_id == rated_by) {
      return res.status(400).json({ error: "You cannot rate yourself." });
    }

    await db.query(
      "INSERT INTO rates (rated_by, rated_user_id, stars, comment) VALUES (?, ?, ?, ?)",
      [rated_by, rated_user_id, stars, comment || null]
    );

    res.status(201).json({ message: "Rating submitted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not submit rating." });
  }
}

