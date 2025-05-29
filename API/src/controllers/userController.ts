import { Request, Response } from "express";
import { JWT_SECRET, SALT_ROUNDS } from "../config/env";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db";

const COOKIE_NAME = "token";

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

        const token = jwt.sign({ id: user.ID, email: user.email }, JWT_SECRET, {
            expiresIn: "10h",
        });

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        }).json({ token, message: "Registro realizado com sucesso" });
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

        const token = jwt.sign({ id: user.ID, email: user.email }, JWT_SECRET, {
            expiresIn: "10h",
        });

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        }).json({ token, message: "Login realizado com sucesso" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export function logout(req: Request, res: Response) {
    res.clearCookie(COOKIE_NAME).json({
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
