import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

interface JwtPayload {
    id: string;
    email?: string;
    iat?: number;
    exp?: number;
}

export function authMiddleware(
    req: Request & { userId?: string },
    res: Response,
    next: NextFunction
) {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ error: "Token não fornecido" });
        return; // apenas sai da função
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token inválido ou expirado" });
        return; // apenas sai da função
    }
}
