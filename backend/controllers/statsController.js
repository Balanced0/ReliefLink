import { db } from "../db/index.js";

export async function getImpactSummary(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const user_id = req.user?.user_id;
    const role = req.user?.role;

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
    // Admins and public users see platform-wide data.
    if (role === "volunteer" && user_id) {
      const [[{ bookmarkCount }]] = await db.query(
        "SELECT COUNT(*) AS bookmarkCount FROM bookmarks WHERE user_id = ?",
        [user_id]
      );
      if (bookmarkCount > 0) {
        areaJoin = " JOIN bookmarks b ON n.area_id = b.area_id ";
        areaCondition = " AND b.user_id = ? ";
        areaParams = [user_id];
      }
    }

    const needsDateFilter = dateFilter.replace(/created_at/g, "n.created_at");

    // 1. Total needs fulfilled
    const [fulfilledResult] = await db.query(
      `SELECT COUNT(DISTINCT n.need_id) as total_fulfilled
       FROM needs n
       ${areaJoin}
       WHERE n.status = 'fulfilled' ${areaCondition} ${needsDateFilter}`,
      [...areaParams, ...dateParams]
    );

    // 2. Most-active volunteers
    const [volunteersResult] = await db.query(
      `SELECT u.user_id, u.name, COUNT(DISTINCT c.need_id) as contributions
       FROM users u
       JOIN claims c ON u.user_id = c.volunteer_id AND c.status = 'fulfilled'
       JOIN needs n ON c.need_id = n.need_id
       ${areaJoin}
       WHERE 1=1 ${areaCondition} ${needsDateFilter}
       GROUP BY u.user_id, u.name
       ORDER BY contributions DESC
       LIMIT 5`,
      [...areaParams, ...dateParams]
    );

    // 3. Needs-by-category breakdown for fulfilled needs
    const [categoryResult] = await db.query(
      `SELECT nc.category, COUNT(DISTINCT n.need_id) as count
       FROM needs n
       JOIN need_categories nc ON n.need_id = nc.need_id
       ${areaJoin}
       WHERE n.status = 'fulfilled' ${areaCondition} ${needsDateFilter}
       GROUP BY nc.category
       ORDER BY count DESC`,
      [...areaParams, ...dateParams]
    );

    res.json({
      total_fulfilled: Number(fulfilledResult[0]?.total_fulfilled) || 0,
      most_active_volunteers: volunteersResult || [],
      needs_by_category: categoryResult || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch impact summary." });
  }
}

