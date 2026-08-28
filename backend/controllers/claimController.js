import { db } from "../db/index.js";

export async function claimNeed(req, res) {
  try {
    const need_id = req.params.id;

    const [needs] = await db.query("SELECT status FROM needs WHERE need_id = ?", [need_id]);

    if (needs.length === 0) {
      return res.status(404).json({ error: "Need not found." });
    }
    if (needs[0].status !== "open") {
      return res.status(400).json({ error: "This need has already been claimed." });
    }

    await db.query(
      "INSERT INTO claims (need_id, volunteer_id) VALUES (?, ?)",
      [need_id, req.user.user_id]
    );

    await db.query("UPDATE needs SET status = 'claimed' WHERE need_id = ?", [need_id]);

    res.status(201).json({ message: "Need claimed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not claim this need. Please try again." });
  }
}

// The volunteer who claimed it marks it fulfilled.
export async function fulfillClaim(req, res) {
  try {
    const claim_id = req.params.id;

    const [claims] = await db.query("SELECT * FROM claims WHERE claim_id = ?", [claim_id]);
    const claim = claims[0];

    if (!claim) {
      return res.status(404).json({ error: "Claim not found." });
    }
    if (claim.volunteer_id !== req.user.user_id) {
      return res.status(403).json({ error: "This isn't your claim." });
    }
    if (claim.status !== "active") {
      return res.status(400).json({ error: "This claim is already resolved." });
    }

    await db.query(
      "UPDATE claims SET status = 'fulfilled', fulfilled_at = NOW() WHERE claim_id = ?",
      [claim_id]
    );
    await db.query("UPDATE needs SET status = 'fulfilled' WHERE need_id = ?", [claim.need_id]);

    res.json({ message: "Marked as fulfilled." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update this claim." });
  }
}