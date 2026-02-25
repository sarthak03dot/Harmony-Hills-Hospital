import express from "express";
import { getAdminStats } from "./admin.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/stats", isAdminAuthenticated, getAdminStats);

export default router;
