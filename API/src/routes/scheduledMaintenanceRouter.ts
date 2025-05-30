import { Router } from "express";
import {
    getAllScheduled,
    getScheduledById,
    createScheduled,
    updateScheduled,
    deleteScheduled,
} from "../controllers/scheduledMaintenanceController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllScheduled);
router.get("/:id", getScheduledById);
router.post("/", createScheduled);
router.put("/:id", updateScheduled);
router.delete("/:id", deleteScheduled);

export default router;
