import { Router } from "express";
import {
    login,
    logout,
    register,
    getUserProfile,
    updateUserProfile,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.use(authMiddleware);

router.post("/logout", logout);
router.get("/me", getUserProfile);
router.put("/me", updateUserProfile);

export default router;
