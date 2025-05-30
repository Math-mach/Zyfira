import express from "express";
import {
    getMaintenanceHistoryByAsset,
    addToMaintenanceHistory,
} from "../controllers/historyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/:assetId", getMaintenanceHistoryByAsset);
router.post("/", addToMaintenanceHistory);

export default router;
