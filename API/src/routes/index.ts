import { Router } from "express";
import userRoutes from "./users";
import assetRoutes from "./asset";
import maintenanceRoutes from "./maintenances";
import scheduledMaintenanceRoutes from "./scheduledMaintenances";

const router = Router();

router.use("/users", userRoutes);
router.use("/assets", assetRoutes);
router.use("/maintenances", maintenanceRoutes);
router.use("/scheduled", scheduledMaintenanceRoutes);

export default router;
