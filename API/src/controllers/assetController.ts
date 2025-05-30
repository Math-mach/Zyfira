import { Request, Response } from "express";
import db from "../config/db";

export async function getAllAssets(
    req: Request & { userId?: string },
    res: Response
) {
    try {
        const assets = await db("assets").where({ user_id: req.userId });
        res.json(assets);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar ativos" });
    }
}

export async function getAssetById(
    req: Request & { userId?: string },
    res: Response
) {
    const { id } = req.params;

    try {
        const asset = await db("assets")
            .where({ id, user_id: req.userId })
            .first();

        if (!asset)
            return res.status(404).json({ error: "Ativo não encontrado" });

        res.json(asset);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar ativo" });
    }
}

export async function createAsset(
    req: Request & { userId?: string },
    res: Response
) {
    const { name, description } = req.body;

    try {
        const [asset] = await db("assets")
            .insert({ name, description, user_id: req.userId })
            .returning("*");

        res.status(201).json(asset);
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar ativo" });
    }
}

export async function updateAsset(
    req: Request & { userId?: string },
    res: Response
) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const [updated] = await db("assets")
            .where({ id, user_id: req.userId })
            .update({ name, description, updated_at: new Date() })
            .returning("*");

        if (!updated)
            return res.status(404).json({ error: "Ativo não encontrado" });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar ativo" });
    }
}

export async function deleteAsset(
    req: Request & { userId?: string },
    res: Response
) {
    const { id } = req.params;

    try {
        const deleted = await db("assets")
            .where({ id, user_id: req.userId })
            .del();

        if (!deleted)
            return res.status(404).json({ error: "Ativo não encontrado" });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar ativo" });
    }
}
