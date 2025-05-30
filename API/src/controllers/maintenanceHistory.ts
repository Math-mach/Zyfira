import { Request, Response } from "express";
import db from "../config/db";

interface HistoryInput {
    asset_id: string;
    scheduled_id?: string;
    title: string;
    condition?: string;
    completed_at?: string;
}

export async function getMaintenanceHistoryByAsset(
    req: Request & { userId?: string },
    res: Response
) {
    const { assetId } = req.params;

    try {
        const history = await db("maintenance_history")
            .join("assets", "maintenance_history.asset_id", "assets.id")
            .where("maintenance_history.asset_id", assetId)
            .andWhere("assets.user_id", req.userId)
            .select(
                "maintenance_history.id",
                "maintenance_history.title",
                "maintenance_history.condition",
                "maintenance_history.completed_at",
                "maintenance_history.due_date"
            )
            .orderBy("maintenance_history.completed_at", "desc");

        if (!history.length)
            return res
                .status(404)
                .json({ error: "Nenhum histórico encontrado." });

        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar histórico." });
    }
}

export async function addToMaintenanceHistory(
    req: Request & { userId?: string },
    res: Response
) {
    const { asset_id, due_date, title, condition, completed_at }: HistoryInput =
        req.body;

    if (!asset_id || !title) {
        return res
            .status(400)
            .json({ error: "asset_id e title são obrigatórios." });
    }

    try {
        const assetExists = await db("assets")
            .where({ id: asset_id, user_id: req.userId })
            .first();

        if (!assetExists) {
            return res
                .status(404)
                .json({ error: "Ativo não encontrado ou sem permissão." });
        }

        const [newHistory] = await db("maintenance_history")
            .insert({
                asset_id,
                due_date: due_date || null,
                title,
                condition: condition || null,
                completed_at: completed_at
                    ? new Date(completed_at)
                    : new Date(),
                user_id: req.userId,
            })
            .returning("*");

        res.status(201).json(newHistory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao adicionar ao histórico." });
    }
}
