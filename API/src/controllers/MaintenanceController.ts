import { Request, Response, NextFunction } from "express";
import db from "../config/db";

export async function getAllScheduled(
    req: Request & { userId?: string },
    res: Response
) {
    try {
        const scheduled = await db("scheduled_maintenances")
            .join("assets", "scheduled_maintenances.asset_id", "assets.id")
            .where("assets.user_id", req.userId)
            .select("scheduled_maintenances.*", "assets.name as asset_name");

        res.json(scheduled);
    } catch (err) {
        console.error("Erro em getAllScheduled:", err);
        res.status(500).json({ error: "Erro ao buscar manutenções agendadas" });
    }
}

export async function getScheduleds(
    req: Request & { userId?: string },
    res: Response,
    next: NextFunction
) {
    const { assetId } = req.params;

    try {
        const scheduled = await db("scheduled_maintenances")
            .join("assets", "scheduled_maintenances.asset_id", "assets.id")
            .where({
                "scheduled_maintenances.asset_id": assetId,
                "assets.user_id": req.userId,
            })
            .select("scheduled_maintenances.*");

        if (scheduled.length === 0) {
            res.status(404).json({ error: "Manutenção agendada não encontrada" });
            return;
        }

        res.json(scheduled);
    } catch (err) {
        console.error("Erro em getScheduleds:", err);
        res.status(500).json({ error: "Erro ao buscar manutenção agendada" });
    }
}

export async function getScheduledById(
    req: Request & { userId?: string },
    res: Response,
    next: NextFunction
) {
    const { assetId, maintenanceId } = req.params;

    try {
        const scheduled = await db("scheduled_maintenances")
            .join("assets", "scheduled_maintenances.asset_id", "assets.id")
            .where({
                "scheduled_maintenances.asset_id": assetId,
                "scheduled_maintenances.id": maintenanceId,
                "assets.user_id": req.userId,
            })
            .select("scheduled_maintenances.*")
            .first();

        if (!scheduled) {
            res.status(404).json({ error: "Manutenção agendada não encontrada" });
            return;
        }

        res.json(scheduled);
    } catch (err) {
        console.error("Erro em getScheduledById:", err);
        res.status(500).json({ error: "Erro ao buscar manutenção agendada" });
    }
}

export async function createScheduled(
    req: Request & { userId?: string },
    res: Response,
    next: NextFunction
) {
    const { asset_id, title, due_date, condition } = req.body;

    try {
        const asset = await db("assets")
            .where({ id: asset_id, user_id: req.userId })
            .first();

        if (!asset) {
            res.status(403).json({ error: "Acesso não autorizado ao ativo" });
            return;
        }

        const [scheduled] = await db("scheduled_maintenances")
            .insert({
                asset_id,
                title,
                due_date,
                condition,
            })
            .returning("*");

        res.status(201).json(scheduled);
    } catch (err) {
        console.error("Erro em createScheduled:", err);
        res.status(500).json({ error: "Erro ao criar manutenção agendada" });
    }
}

export async function updateScheduled(
    req: Request & { userId?: string },
    res: Response,
    next: NextFunction
) {
    const { id } = req.params;
    const updates = req.body;

    try {
        const result = await db("scheduled_maintenances")
            .join("assets", "scheduled_maintenances.asset_id", "assets.id")
            .select("scheduled_maintenances.asset_id", "assets.user_id")
            .where("scheduled_maintenances.id", id)
            .first();

        if (!result || result.user_id !== req.userId) {
            res.status(403).json({ error: "Acesso negado" });
            return;
        }

        const [updated] = await db("scheduled_maintenances")
            .where({ id })
            .update({ ...updates, updated_at: new Date() })
            .returning("*");

        if (!updated) {
            res.status(404).json({ error: "Manutenção não encontrada" });
            return;
        }

        res.json(updated);
    } catch (err) {
        console.error("Erro em updateScheduled:", err);
        res.status(500).json({
            error: "Erro ao atualizar manutenção agendada",
        });
    }
}

export async function deleteScheduled(
    req: Request & { userId?: string },
    res: Response,
    next: NextFunction
) {
    const { id } = req.params;

    try {
        const deleted = await db("scheduled_maintenances")
            .join("assets", "scheduled_maintenances.asset_id", "assets.id")
            .where("scheduled_maintenances.id", id)
            .andWhere("assets.user_id", req.userId)
            .del();

        if (!deleted) {
            res.status(404).json({ error: "Manutenção agendada não encontrada" });
            return;
        }

        res.status(204).send();
    } catch (err) {
        console.error("Erro em deleteScheduled:", err);
        res.status(500).json({ error: "Erro ao deletar manutenção agendada" });
    }
}