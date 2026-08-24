import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // here its getting { user_id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired login." });
  }
}
