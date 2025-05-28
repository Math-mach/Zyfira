import { Request, Response } from "express";
import { JWT_SECRET, SALT_ROUNDS } from "../config/env";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db";

const COOKIE_NAME = "token";

export async function register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            res.status(400).json({ error: "Dados faltando" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const valid = await db("users").where({ email }).first();

        if (valid) {
            res.status(400).json({ error: "Usuário já cadastrado" });
            return;
        }

        const returnUser = await db("users")
            .insert({ username, email, password: hashedPassword })
            .returning(["ID", "email"]);

        const user = returnUser[0];

        const token = jwt.sign({ id: user.ID, email: user.email }, JWT_SECRET, {
            expiresIn: "10h",
        });

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        }).json({ message: "Registro realizado com sucesso" });
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

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "10h",
        });

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        }).json({ message: "Login realizado com sucesso" });
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
