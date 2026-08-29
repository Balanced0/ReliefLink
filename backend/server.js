import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import needRoutes from "./routes/needRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/needs", needRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/reports", reportRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`ReliefLink backend running on http://localhost:${port}`);
});
