import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
    Chip,
    Stack,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

type ScheduledMaintenance = {
    id: string;
    title: string;
    due_date: string;
    condition: string | null;
    resolved: boolean;
    asset_id: string;
};

function getStatus(dueDateStr: string): {
    label: string;
    color: "default" | "error" | "warning";
} {
    const today = new Date();
    const dueDate = new Date(dueDateStr);

    const diffTime = dueDate.getTime() - today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: "Atrasado", color: "error" };
    if (diffDays === 0) return { label: "Vence hoje", color: "warning" };
    if (diffDays === 1) return { label: "Vence amanhã", color: "warning" };
    return {
        label: `Vence em ${dueDate.toLocaleDateString("pt-BR")}`,
        color: "default",
    };
}

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<ScheduledMaintenance[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/scheduled", {
                    credentials: "include",
                });

                const data: ScheduledMaintenance[] = await res.json();

                const filtered = data
                    .filter((item) => !item.resolved && item.due_date)
                    .sort((a, b) => {
                        const d1 = new Date(a.due_date).getTime();
                        const d2 = new Date(b.due_date).getTime();
                        return d1 - d2;
                    });

                setItems(filtered);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Box p={3}>
            <Stack direction="row" alignItems="center" gap={1} mb={3}>
                <CalendarMonthIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                    Painel de Manutenções
                </Typography>
            </Stack>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : items.length === 0 ? (
                <Typography color="green">
                    🎉 Nenhuma manutenção pendente!
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {items.map((item) => {
                        const status = getStatus(item.due_date);
                        return (
                            <Card key={item.id} variant="outlined">
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Condição:{" "}
                                            {item.condition ||
                                                "Não especificada"}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={status.label}
                                        color={status.color}
                                        icon={
                                            status.color !== "default" ? (
                                                <WarningAmberIcon />
                                            ) : undefined
                                        }
                                    />
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            )}

            <Typography
                variant="caption"
                display="block"
                mt={3}
                color="text.secondary"
            >
                Apenas manutenções não resolvidas são exibidas.
            </Typography>
        </Box>
    );
}
