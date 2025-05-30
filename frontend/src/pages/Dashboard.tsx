import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Fab,
    List,
    ListItem,
    ListItemText,
    Chip,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import { useEffect, useState } from "react";
import ModalAdicionarManutencaoAgendada from "../components/ModalAdicionarManutencaoAgendada";
import EditAssetModal from "../components/EditMaintenancesModal";

interface ScheduledMaintenance {
    id: string;
    title: string;
    due_date: string;
    resolved: boolean;
    asset_id: string;
    asset_name: string;
    condition: string;
    diasRestantes: number;
}

export default function Dashboard() {
    const [idManu, setIdManu] = useState<string | null>(null);
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [manutencoes, setManutencoes] = useState<ScheduledMaintenance[]>([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const fetchManutencoes = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/scheduled", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Erro ao buscar manutenções");

            const data = await res.json();
            const hoje = new Date();

            const filtradas = data
                .filter((m: ScheduledMaintenance) => !m.resolved)
                .map((m: ScheduledMaintenance) => ({
                    ...m,
                    diasRestantes: Math.floor(
                        (new Date(m.due_date).getTime() - hoje.getTime()) /
                            (1000 * 60 * 60 * 24)
                    ),
                }))
                .sort((a, b) => a.diasRestantes - b.diasRestantes);

            setManutencoes(filtradas);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setFeedback({ type: "error", message: err.message });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManutencoes();
    }, []);

    const getStatus = (dias: number) => {
        if (dias + 1 === 0) return { label: "HOJE", color: "warning" };
        if (dias < 0) return { label: "ATRASADA", color: "error" };
        if (dias <= 3)
            return { label: `Faltam ${dias + 1} dias`, color: "info" };
        return { label: `Em ${dias} dias`, color: "default" };
    };

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Painel de Manutenções Agendadas
            </Typography>

            {feedback && (
                <Alert
                    severity={feedback.type}
                    onClose={() => setFeedback(null)}
                    variant="filled"
                >
                    {feedback.message}
                </Alert>
            )}

            {loading ? (
                <CircularProgress />
            ) : manutencoes.length === 0 ? (
                <Typography>Nenhuma manutenção agendada urgente.</Typography>
            ) : (
                <Paper elevation={3} sx={{ mt: 2 }}>
                    <List>
                        {manutencoes.map((manutencao) => {
                            const status = getStatus(manutencao.diasRestantes);
                            return (
                                <ListItem key={manutencao.id} divider>
                                    <ListItemText
                                        primary={manutencao.title}
                                        secondary={`Ativo: ${
                                            manutencao.asset_name
                                        } — Prevista para: ${new Date(
                                            manutencao.due_date
                                        ).toLocaleDateString("pt-BR")}`}
                                    />
                                    {manutencao.condition && (
                                        <Chip
                                            label={`${manutencao.condition}KM`}
                                        />
                                    )}
                                    <Chip
                                        label={status.label}
                                        color={
                                            status.color as
                                                | "error"
                                                | "warning"
                                                | "info"
                                                | "default"
                                        }
                                    />
                                    <IconButton
                                        onClick={() => {
                                            setSelectedAssetId(
                                                manutencao.asset_id
                                            );

                                            setIdManu(manutencao.id);
                                            setEditOpen(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            )}

            <Fab
                color="primary"
                onClick={() => setOpenModal(true)}
                sx={{ position: "fixed", bottom: 24, right: 24 }}
            >
                <AddIcon />
            </Fab>

            <ModalAdicionarManutencaoAgendada
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={() => {
                    setOpenModal(false);
                    fetchManutencoes();
                }}
            />

            {selectedAssetId && (
                <EditAssetModal
                    id={idManu}
                    assetId={selectedAssetId}
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    onUpdated={() => {
                        setEditOpen(false);
                        fetchManutencoes();
                    }}
                />
            )}
        </Box>
    );
}
