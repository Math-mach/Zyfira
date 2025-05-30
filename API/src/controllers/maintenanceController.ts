import { Request, Response } from "express";
import db from "../config/db";

export async function getAllMaintenances(
    req: Request & { userId?: string },
    res: Response
) {
    try {
        const maintenances = await db("maintenances")
            .join("assets", "maintenances.asset_id", "assets.id")
            .where("assets.user_id", req.userId)
            .select("maintenances.*");

        res.json(maintenances);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar manutenções" });
    }
}

export async function getMaintenanceById(
    req: Request & { userId?: string },
    res: Response
) {
    const { id } = req.params;

    try {
        const maintenance = await db("maintenances")
            .join("assets", "maintenances.asset_id", "assets.id")
            .where("maintenances.id", id)
            .andWhere("assets.user_id", req.userId)
            .select("maintenances.*")
            .first();

        if (!maintenance)
            return res.status(404).json({ error: "Manutenção não encontrada" });

        res.json(maintenance);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar manutenção" });
    }
}

export async function createMaintenance(
    req: Request & { userId?: string },
    res: Response
) {
    const {
        asset_id,
        title,
        performed_at,
        description,
        next_due_date,
        next_due_condition,
    } = req.body;

    try {
        const asset = await db("assets")
            .where({ id: asset_id, user_id: req.userId })
            .first();
        if (!asset)
            return res
                .status(403)
                .json({ error: "Acesso não autorizado ao ativo" });

        const [maintenance] = await db("maintenances")
            .insert({
                asset_id,
                title,
                performed_at,
                description,
                next_due_date,
                next_due_condition,
            })
            .returning("*");

        res.status(201).json(maintenance);
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar manutenção" });
    }
}

export async function updateMaintenance(
    req: Request & { userId?: string },
    res: Response
) {
    const { id } = req.params;
    const updates = req.body;

    try {
        const [maintenance] = await db("maintenances")
            .join("assets", "maintenances.asset_id", "assets.id")
            .where("maintenances.id", id)
            .andWhere("assets.user_id", req.userId)
            .update({ ...updates, updated_at: new Date() })
            .returning("maintenances.*");

        if (!maintenance)
            return res.status(404).json({ error: "Manutenção não encontrada" });

        res.json(maintenance);
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar manutenção" });
    }
}

export async function deleteMaintenance(
    req: Request & { userId?: string },
    res: Response
) {
    const { id } = req.params;

    try {
        const deleted = await db("maintenances")
            .join("assets", "maintenances.asset_id", "assets.id")
            .where("maintenances.id", id)
            .andWhere("assets.user_id", req.userId)
            .del();

        if (!deleted)
            return res.status(404).json({ error: "Manutenção não encontrada" });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar manutenção" });
    }
}
