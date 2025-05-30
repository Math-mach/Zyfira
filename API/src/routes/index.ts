import { Router } from "express";
import userRoutes from "./users";
import assetRoutes from "./asset";
import historyRoutes from "./history";
import scheduledMaintenanceRoutes from "./scheduledMaintenances";

const router = Router();

router.use("/users", userRoutes);
router.use("/assets", assetRoutes);
router.use("/history", historyRoutes);
router.use("/scheduled", scheduledMaintenanceRoutes);

export default router;
