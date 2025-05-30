import { Request, Response } from "express";
import db from "../config/db";

type AuthenticatedRequest = Request & { userId?: string };

const handleError = (res: Response, message: string, status = 500) => {
    return res.status(status).json({ error: message });
};

export async function getAllAssets(req: AuthenticatedRequest, res: Response) {
    try {
        const assets = await db("assets").where({ user_id: req.userId });
        return res.json(assets);
    } catch {
        return handleError(res, "Erro ao buscar ativos");
    }
}

export async function getAssetById(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    try {
        const asset = await db("assets")
            .where({ id, user_id: req.userId })
            .first();

        if (!asset) return handleError(res, "Ativo não encontrado", 404);

        return res.json(asset);
    } catch {
        return handleError(res, "Erro ao buscar ativo");
    }
}

export async function createAsset(req: AuthenticatedRequest, res: Response) {
    const { name, description } = req.body;

    try {
        const [asset] = await db("assets")
            .insert({ name, description, user_id: req.userId })
            .returning("*");

        return res.status(201).json(asset);
    } catch {
        return handleError(res, "Erro ao criar ativo");
    }
}

export async function updateAsset(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const [updated] = await db("assets")
            .where({ id, user_id: req.userId })
            .update({ name, description, updated_at: new Date() })
            .returning("*");

        if (!updated) return handleError(res, "Ativo não encontrado", 404);

        return res.json(updated);
    } catch {
        return handleError(res, "Erro ao atualizar ativo");
    }
}

export async function deleteAsset(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    try {
        const deleted = await db("assets")
            .where({ id, user_id: req.userId })
            .del();

        if (!deleted) return handleError(res, "Ativo não encontrado", 404);

        return res.sendStatus(204);
    } catch {
        return handleError(res, "Erro ao deletar ativo");
    }
}
