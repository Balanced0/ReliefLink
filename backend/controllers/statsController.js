import { db } from "../db/index.js";

export async function getImpactSummary(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const user_id = req.user.user_id;
    const role = req.user.role;

    let dateFilter = "";
    let dateParams = [];

    if (startDate && endDate) {
      dateFilter = " AND created_at >= ? AND created_at <= ?";
      dateParams = [startDate, endDate];
    } else if (startDate) {
      dateFilter = " AND created_at >= ?";
      dateParams = [startDate];
    } else if (endDate) {
      dateFilter = " AND created_at <= ?";
      dateParams = [endDate];
    }

    let areaJoin = "";
    let areaCondition = "";
    let areaParams = [];

    // Volunteers see data filtered by their bookmarked areas.
    // Admins see platform-wide data.
    if (role === "volunteer") {
      areaJoin = " JOIN bookmarks b ON n.area_id = b.area_id ";
      areaCondition = " AND b.user_id = ? ";
      areaParams = [user_id];
    }

    // 1. Total needs fulfilled
    const fulfilledFilter = dateFilter.replace(/created_at/g, "lc.fulfilled_at");
    const [fulfilledResult] = await db.query(
      `SELECT COUNT(DISTINCT lc.need_id) as total_fulfilled
       FROM logs_contribution lc
       JOIN needs n ON lc.need_id = n.need_id
       ${areaJoin}
       WHERE 1=1 ${areaCondition} ${fulfilledFilter}`,
      [...areaParams, ...dateParams]
    );

    // 2. Most-active volunteers
    const [volunteersResult] = await db.query(
      `SELECT u.user_id, u.name, COUNT(lc.contribution_id) as contributions
       FROM users u
       JOIN logs_contribution lc ON u.user_id = lc.volunteer_id
       JOIN needs n ON lc.need_id = n.need_id
       ${areaJoin}
       WHERE 1=1 ${areaCondition} ${fulfilledFilter}
       GROUP BY u.user_id, u.name
       ORDER BY contributions DESC
       LIMIT 5`,
      [...areaParams, ...dateParams]
    );

    // 3. Needs-by-category breakdown
    const needsDateFilter = dateFilter.replace(/created_at/g, "n.created_at");
    const [categoryResult] = await db.query(
      `SELECT nc.category, COUNT(n.need_id) as count
       FROM needs n
       JOIN need_categories nc ON n.need_id = nc.need_id
       ${areaJoin}
       WHERE 1=1 ${areaCondition} ${needsDateFilter}
       GROUP BY nc.category`,
      [...areaParams, ...dateParams]
    );

    res.json({
      total_fulfilled: fulfilledResult[0].total_fulfilled,
      most_active_volunteers: volunteersResult,
      needs_by_category: categoryResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch impact summary." });
  }
}

