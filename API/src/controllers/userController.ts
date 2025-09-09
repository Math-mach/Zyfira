import { Request, Response } from "express";
import { JWT_SECRET, SALT_ROUNDS } from "../config/env";
import bcrypt from "bcrypt";
import jwt, { JwtPayload as JwtPayloadType } from "jsonwebtoken";
import db from "../config/db";
import { generateTokens, setRefreshTokenCookie } from "../util/auth";

export async function register(req: Request, res: Response) {
    let { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            res.status(400).json({ error: "Dados faltando" });
            return;
        }

        password = await bcrypt.hash(password, SALT_ROUNDS);

        const valid = await db("users").where({ email }).first();

        if (valid) {
            res.status(400).json({ error: "Usuário já cadastrado" });
            return;
        }

        const returnUser = await db("users")
            .insert({ username, email, password })
            .returning(["ID", "email"]);

        const user = returnUser[0];

        const { accessToken, refreshToken } = generateTokens({
            id: user.ID,
            email: user.email,
        });

        setRefreshTokenCookie(res, refreshToken);

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.json({
            message: "Registro realizado com sucesso",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const user = await db("users").where({ email }).first();

        if (!user) {
            res.status(400).json({ error: "Usuário não encontrado" });
            return;
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            res.status(401).json({ error: "Senha incorreta" });
            return;
        }

        const { accessToken, refreshToken } = generateTokens({
            id: user.ID,
            email: user.email,
        });

        setRefreshTokenCookie(res, refreshToken);

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.json({
            message: "Login realizado com sucesso",
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

const REFRESH_COOKIE = "refresh_token";

export async function refresh(req: Request, res: Response): Promise<void> {
    try {
        const token = req.cookies[REFRESH_COOKIE];
        if (!token) {
            res.status(401).json({ error: "Refresh token não encontrado" });
            return;
        }

        let decoded: JwtPayloadType;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadType;
        } catch (err) {
            res.status(403).json({ error: "Refresh token inválido ou expirado" });
            return;
        }

        const { id, email } = decoded;
        const { accessToken, refreshToken } = generateTokens({ id, email });

        setRefreshTokenCookie(res, refreshToken);

        res.json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export function logout(req: Request, res: Response) {
    res.clearCookie(REFRESH_COOKIE, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    }).json({
        message: "Logout realizado com sucesso",
    });
}


export async function getUserProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).userId;

        const user = await db("users")
            .select("ID", "username", "email", "created_in", "updated_in")
            .where("ID", userId)
            .first();

        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export async function updateUserProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).userId;
        const { username, email, password } = req.body;

        const updateData: any = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password)
            updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
        updateData.updated_in = new Date();

        const updated = await db("users")
            .where("ID", userId)
            .update(updateData);

        if (!updated) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }

        res.json({ message: "Perfil atualizado com sucesso" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
