import { db } from "../db/index.js";

export async function createOrganization(req, res) {
  try {
    if (req.user.role === "affected") {
      return res
        .status(403)
        .json({ error: "Only volunteers can create or join organizations." });
    }

    const { org_name, description } = req.body;

    if (!org_name) {
      return res.status(400).json({ error: "Organization name is required." });
    }

    const [result] = await db.query(
      `INSERT INTO organizations (org_name, description, owner_user_id)
       VALUES (?, ?, ?)`,
      [org_name, description || null, req.user.user_id],
    );

    await db.query(
      `INSERT INTO joins (user_id, org_id, status) VALUES (?, ?, 'approved')`,
      [req.user.user_id, result.insertId],
    );

    await db.query(
      `UPDATE users SET account_type = 'organization_member' WHERE user_id = ?`,
      [req.user.user_id],
    );

    res.status(201).json({
      message: "Organization created successfully.",
      org_id: result.insertId,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "An organization with that name already exists." });
    }
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not create the organization. Please try again." });
  }
}

export async function getOrganizations(req, res) {
  try {
    const [orgs] = await db.query(
      `SELECT o.org_id, o.org_name, o.description, o.owner_user_id, u.name AS owner_name
       FROM organizations o
       JOIN users u ON o.owner_user_id = u.user_id
       ORDER BY o.created_at DESC`,
    );

    res.json(orgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load organizations." });
  }
}


export async function requestToJoin(req, res) {
  try {
    if (req.user.role === "affected") {
      return res
        .status(403)
        .json({ error: "Only volunteers can create or join organizations." });
    }

    const orgId = req.params.org_id;

    const [result] = await db.query(
      `INSERT IGNORE INTO joins (user_id, org_id) VALUES (?, ?)`,
      [req.user.user_id, orgId],
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ error: "You have already requested to join this organization." });
    }

    res.status(201).json({ message: "Join request sent successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not send join request. Please try again." });
  }
}


export async function respondToJoinRequest(req, res) {
  try {
    const { org_id, user_id } = req.params;
    const { status } = req.body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Status must be 'approved' or 'rejected'." });
    }

    const [orgs] = await db.query(
      `SELECT owner_user_id FROM organizations WHERE org_id = ?`,
      [org_id],
    );

    if (orgs.length === 0) {
      return res.status(404).json({ error: "Organization not found." });
    }

    if (orgs[0].owner_user_id !== req.user.user_id) {
      return res
        .status(403)
        .json({ error: "Only the organization owner can approve or reject requests." });
    }

    await db.query(
      `UPDATE joins SET status = ? WHERE user_id = ? AND org_id = ? AND status = 'pending'`,
      [status, user_id, org_id],
    );

    res.json({ message: `Request ${status} successfully.` });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not update the join request. Please try again." });
  }
}

export async function getOrganizationMembers(req, res) {
  try {
    const status = req.query.status || "approved";

    const [members] = await db.query(
      `SELECT u.user_id, u.name, j.requested_at
       FROM joins j
       JOIN users u ON j.user_id = u.user_id
       WHERE j.org_id = ? AND j.status = ?`,
      [req.params.org_id, status],
    );

    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load organization members." });
  }
}
