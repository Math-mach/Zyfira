import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type HistoryItem = {
    id: string;
    title: string;
    condition: string;
    due_date: string;
    completed_at: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    assetId: string;
};

export default function MaintenanceHistoryModal({
    open,
    onClose,
    assetId,
}: Props) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!open) return;

        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/history/${assetId}`, {
                    credentials: "include",
                });
                const data = await res.json();
                setHistory(data);
            } catch (err) {
                console.error("Erro ao buscar histórico", err);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [open, assetId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Histórico de Manutenções</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : !Array.isArray(history) ? (
                    <Typography>Nenhum histórico encontrado.</Typography>
                ) : (
                    <List>
                        {Array.isArray(history) &&
                            history.map((item) => (
                                <ListItem
                                    key={item.id}
                                    sx={{ border: "1px double black" }}
                                >
                                    <ListItemText
                                        primary={`Manutenção: ${item.title}`}
                                        secondary={`Cond: ${
                                            item.condition
                                                ? `${item.condition}KM`
                                                : "nenhuma"
                                        } - Prevista: ${
                                            item.due_date
                                                ? new Date(
                                                      item.due_date
                                                  ).toLocaleDateString()
                                                : "não informada"
                                        } - Concluída: ${
                                            item.completed_at
                                                ? new Date(
                                                      item.completed_at
                                                  ).toLocaleDateString()
                                                : "não informada"
                                        }`}
                                    />
                                </ListItem>
                            ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
}
