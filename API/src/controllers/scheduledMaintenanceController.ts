import { Request, Response } from "express";
import db from "../config/db";

export async function getAllScheduled(
    req: Request & { userId?: string },
    res: Response
) {
    try {
        const scheduled = await db("scheduled_maintenances")
            .join("assets", "scheduled_maintenances.asset_id", "assets.id")
            .where("assets.user_id", req.userId)
            .select("scheduled_maintenances.*");

        res.json(scheduled);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar manutenções agendadas" });
    }
}

export async function getScheduledById(
    req: Request & { userId?: string },
    res: Response
) {
    const { id } = req.params;

    try {
        const scheduled = await db("scheduled_maintenances")
            .join("assets", "scheduled_maintenances.asset_id", "assets.id")
            .where("scheduled_maintenances.id", id)
            .andWhere("assets.user_id", req.userId)
            .select("scheduled_maintenances.*")
            .first();

        if (!scheduled)
            return res
                .status(404)
                .json({ error: "Manutenção agendada não encontrada" });

        res.json(scheduled);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar manutenção agendada" });
    }
}

export async function createScheduled(
    req: Request & { userId?: string },
    res: Response
) {
    const { asset_id, title, due_date, condition, maintenance_id } = req.body;

    try {
        const asset = await db("assets")
            .where({ id: asset_id, user_id: req.userId })
            .first();
        if (!asset)
            return res
                .status(403)
                .json({ error: "Acesso não autorizado ao ativo" });

        const [scheduled] = await db("scheduled_maintenances")
            .insert({
                asset_id,
                title,
                due_date,
                condition,
                maintenance_id,
            })
            .returning("*");

        res.status(201).json(scheduled);
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar manutenção agendada" });
    }
}

export async function updateScheduled(
    req: Request & { userId?: string },
    res: Response
) {
    const { id } = req.params;
    const updates = req.body;

    try {
        const [updated] = await db("scheduled_maintenances")
            .join("assets", "scheduled_maintenances.asset_id", "assets.id")
            .where("scheduled_maintenances.id", id)
            .andWhere("assets.user_id", req.userId)
            .update({ ...updates, updated_at: new Date() })
            .returning("scheduled_maintenances.*");

        if (!updated)
            return res
                .status(404)
                .json({ error: "Manutenção agendada não encontrada" });

        res.json(updated);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao atualizar manutenção agendada",
        });
    }
}

export async function deleteScheduled(
    req: Request & { userId?: string },
    res: Response
) {
    const { id } = req.params;

    try {
        const deleted = await db("scheduled_maintenances")
            .join("assets", "scheduled_maintenances.asset_id", "assets.id")
            .where("scheduled_maintenances.id", id)
            .andWhere("assets.user_id", req.userId)
            .del();

        if (!deleted)
            return res
                .status(404)
                .json({ error: "Manutenção agendada não encontrada" });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar manutenção agendada" });
    }
}
