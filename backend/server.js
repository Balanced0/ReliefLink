import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import needRoutes from "./routes/needRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/needs", needRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`ReliefLink backend running on http://localhost:${port}`);
});
