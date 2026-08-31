import { db } from "../db/index.js";
export async function getFlaggedNeeds(req, res) {
  try {
    const [needs] = await db.query(
      `SELECT DISTINCT needs.*, areas.area_name, users.name AS poster_name
       FROM needs
       LEFT JOIN reports ON reports.need_id = needs.need_id AND reports.resolved = FALSE
       JOIN areas ON needs.area_id = areas.area_id
       JOIN users ON needs.posted_by = users.user_id
       WHERE needs.is_hidden = TRUE OR reports.need_id IS NOT NULL
       ORDER BY needs.created_at DESC`,
    );

    const [reports] = await db.query(
      `SELECT reports.*, users.name AS reporter_name
       FROM reports
       JOIN users ON reports.reported_by = users.user_id
       WHERE reports.resolved = FALSE`,
    );

    for (const need of needs) {
      need.reports = reports.filter((r) => r.need_id === need.need_id);
    }

    res.json(needs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load flagged needs." });
  }
}

export async function moderateNeed(req, res) {
  try {
    const need_id = req.params.need_id;
    const { is_hidden } = req.body;

    if (typeof is_hidden !== "boolean") {
      return res
        .status(400)
        .json({ error: "is_hidden must be true or false." });
    }

    await db.query("UPDATE needs SET is_hidden = ? WHERE need_id = ?", [
      is_hidden,
      need_id,
    ]);
    await db.query(
      "UPDATE reports SET resolved = TRUE WHERE need_id = ? AND resolved = FALSE",
      [need_id],
    );

    res.json({ message: "Need moderated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not moderate this need." });
  }
}

export async function getAllUsers(req, res) {
  try {
    const [users] = await db.query(
      `SELECT user_id, name, email, role, account_type, account_status, created_at
       FROM users
       ORDER BY created_at DESC`,
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load users." });
  }
}

export async function updateUserStatus(req, res) {
  try {
    const target_id = req.params.id;
    const { account_status } = req.body;

    if (!["active", "suspended"].includes(account_status)) {
      return res
        .status(400)
        .json({ error: "account_status must be 'active' or 'suspended'." });
    }
    if (Number(target_id) === req.user.user_id) {
      return res
        .status(400)
        .json({ error: "You cannot change your own account status." });
    }

    await db.query("UPDATE users SET account_status = ? WHERE user_id = ?", [
      account_status,
      target_id,
    ]);

    res.json({ message: "User status updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update this user." });
  }
}
