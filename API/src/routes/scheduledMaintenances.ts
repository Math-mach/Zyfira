import { Router } from "express";
import {
    getAllScheduled,
    getScheduledById,
    createScheduled,
    updateScheduled,
    deleteScheduled,
    getScheduleds,
} from "../controllers/scheduledMaintenanceController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllScheduled);
router.get("/:assetId", getScheduleds);
router.get("/:assetId/:maintenanceId", getScheduledById);
router.post("/", createScheduled);
router.put("/:id", updateScheduled);
router.delete("/:id", deleteScheduled);

export default router;
