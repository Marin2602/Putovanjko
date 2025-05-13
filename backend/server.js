import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import putovanjaRoute from "./routes/putovanja.route.js";  // Dodaj import rute
import authRoute from "./routes/auth.route.js";
import jwt from "jsonwebtoken";
import mojSvijetRoutes from "./routes/mojSvijet.route.js";




dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Dodaj rutu za /api/putovanja
app.use("/api/putovanja", putovanjaRoute);
app.use("/api/auth", authRoute);
app.use("/api/moj-svijet", mojSvijetRoutes);

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});


