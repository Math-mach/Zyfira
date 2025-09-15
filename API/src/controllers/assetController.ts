import { Request, Response, NextFunction } from "express";
import db from "../config/db";

type AuthenticatedRequest = Request & { userId?: string };

const handleError = (res: Response, message: string, status = 500) => {
    return res.status(status).json({ error: message });
};

export async function getAllAssets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const assets = await db("assets").where({ user_id: req.userId });
        res.json(assets);
    } catch (err) {
        handleError(res, "Erro ao buscar ativos");
    }
}

export async function getAssetById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const { id } = req.params;

    try {
        const asset = await db("assets")
            .where({ id, user_id: req.userId })
            .first();

        if (!asset) {
            handleError(res, "Ativo não encontrado", 404);
            return;
        }

        res.json(asset);
    } catch {
        handleError(res, "Erro ao buscar ativo");
    }
}


export async function createAsset(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const { name, description } = req.body;

    try {
        const [asset] = await db("assets")
            .insert({ name, description, user_id: req.userId })
            .returning("*");

        res.status(201).json(asset);
    } catch {
        handleError(res, "Erro ao criar ativo");
    }
}

export async function updateAsset(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const [updated] = await db("assets")
            .where({ id, user_id: req.userId })
            .update({ name, description, updated_at: new Date() })
            .returning("*");

        if (!updated) {
            handleError(res, "Ativo não encontrado", 404);
            return;
        }

        res.json(updated);
    } catch {
        handleError(res, "Erro ao atualizar ativo");
    }
}

export async function deleteAsset(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const { id } = req.params;

    try {
        const deleted = await db("assets")
            .where({ id, user_id: req.userId })
            .del();

        if (!deleted) {
            handleError(res, "Ativo não encontrado", 404);
            return;
        }

        res.sendStatus(204);
    } catch {
        handleError(res, "Erro ao deletar ativo");
    }
}
