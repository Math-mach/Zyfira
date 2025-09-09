import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { Response } from "express";

const REFRESH_COOKIE = "refresh_token";

export function generateTokens(payload: object) {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_COOKIE, refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
    });
}
