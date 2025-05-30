import { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Tabs,
    Tab,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Typography,
    Alert,
} from "@mui/material";

interface ScheduledMaintenance {
    id: string;
    title: string;
    due_date: string;
    condition: string;
    resolved: boolean;
}

interface AssetData {
    id: string;
    name: string;
    description: string;
}

interface Props {
    id: string;
    assetId: string;
    onClose: () => void;
    open: boolean;
    onUpdated: () => void;
}

const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function EditAssetModal({
    id,
    assetId,
    onClose,
    open,
    onUpdated,
}: Props) {
    const [nextDate, setNextDate] = useState("");
    const [nextCondition, setNextCondition] = useState("");
    const [tab, setTab] = useState(1);
    const [asset, setAsset] = useState<AssetData | null>(null);
    const [maintenance, setMaintenance] = useState<ScheduledMaintenance | null>(
        null
    );
    const [completed, setCompleted] = useState(false);
    const [scheduleNew, setScheduleNew] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);

    useEffect(() => {
        if (!open || !assetId) return;

        setAsset(null);
        setMaintenance(null);
        setCompleted(false);
        setScheduleNew(false);
        setFeedback(null);

        const fetchData = async () => {
            try {
                const [assetRes, maintenanceRes] = await Promise.all([
                    fetch(`/api/assets/${assetId}`, { credentials: "include" }),
                    fetch(`/api/scheduled/${assetId}/${id}`, {
                        credentials: "include",
                    }),
                ]);

                if (!assetRes.ok || !maintenanceRes.ok)
                    throw new Error("Erro ao buscar dados.");

                const assetData = await assetRes.json();
                const maintData = await maintenanceRes.json();

                setAsset(assetData);
                setMaintenance(maintData);
            } catch {
                setFeedback({
                    type: "error",
                    message: "Erro ao carregar informações.",
                });
            }
        };

        fetchData();
    }, [open, assetId, id]);

    const handleUpdate = async () => {
        try {
            if (!asset) return;

            await fetch(`/api/assets/${asset.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: asset.name,
                    description: asset.description,
                }),
            });

            if (maintenance) {
                await fetch(`/api/scheduled/${maintenance.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        title: maintenance.title,
                        due_date: maintenance.due_date,
                        condition: maintenance.condition,
                        resolved: completed,
                    }),
                });

                if (completed && scheduleNew) {
                    await fetch("/api/history", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            asset_id: asset.id,
                            title: maintenance.title,
                            due_date: maintenance.due_date,
                            condition: maintenance.condition,
                        }),
                    });

                    await fetch(`/api/scheduled`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            asset_id: asset.id,
                            title: maintenance.title,
                            due_date: nextDate,
                            condition: nextCondition,
                            resolved: false,
                        }),
                    });
                }
            }

            setFeedback({
                type: "success",
                message: "Dados atualizados com sucesso.",
            });
            onUpdated();
        } catch {
            setFeedback({
                type: "error",
                message: "Erro ao salvar alterações.",
            });
        }
    };

    const renderTabs = () => {
        return (
            <>
                <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
                    <Tab label="Informações do Ativo" />
                    <Tab label="Manutenção" />
                </Tabs>

                {tab === 0 && asset && (
                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Nome"
                            value={asset.name}
                            onChange={(e) =>
                                setAsset({ ...asset, name: e.target.value })
                            }
                            fullWidth
                        />
                        <TextField
                            label="Descrição"
                            value={asset.description}
                            onChange={(e) =>
                                setAsset({
                                    ...asset,
                                    description: e.target.value,
                                })
                            }
                            multiline
                            rows={3}
                            fullWidth
                        />
                    </Box>
                )}

                {tab === 1 && (
                    <>
                        {maintenance ? (
                            <Box
                                sx={{
                                    mt: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        mt: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                    }}
                                >
                                    <TextField
                                        label="Título"
                                        value={maintenance.title}
                                        onChange={(e) =>
                                            setMaintenance({
                                                ...maintenance,
                                                title: e.target.value,
                                            })
                                        }
                                        disabled={completed}
                                        fullWidth
                                    />
                                    <TextField
                                        type="date"
                                        label="Data Prevista"
                                        value={maintenance.due_date.slice(
                                            0,
                                            10
                                        )}
                                        onChange={(e) =>
                                            setMaintenance({
                                                ...maintenance,
                                                due_date: e.target.value,
                                            })
                                        }
                                        disabled={completed}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Condição (ex: 10.000 km)"
                                        value={maintenance.condition}
                                        onChange={(e) =>
                                            setMaintenance({
                                                ...maintenance,
                                                condition: e.target.value,
                                            })
                                        }
                                        disabled={completed}
                                        fullWidth
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={completed}
                                                onChange={(e) =>
                                                    setCompleted(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        }
                                        label="Marcar como concluída"
                                    />
                                    {completed && (
                                        <>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={scheduleNew}
                                                        onChange={(e) =>
                                                            setScheduleNew(
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                }
                                                label="Deseja agendar nova manutenção?"
                                            />

                                            {scheduleNew && (
                                                <>
                                                    <TextField
                                                        type="date"
                                                        label="Data da próxima manutenção"
                                                        value={nextDate}
                                                        onChange={(e) =>
                                                            setNextDate(
                                                                e.target.value
                                                            )
                                                        }
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            min: new Date()
                                                                .toISOString()
                                                                .split("T")[0],
                                                        }}
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        label="Proxima Condição (ex: 10.000 km)"
                                                        value={nextCondition}
                                                        onChange={(e) =>
                                                            setNextCondition(
                                                                e.target.value
                                                            )
                                                        }
                                                        fullWidth
                                                    />
                                                </>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Box>
                        ) : (
                            <Typography mt={2}>
                                Nenhuma manutenção ativa encontrada.
                            </Typography>
                        )}
                    </>
                )}
            </>
        );
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Editar Ativo
                </Typography>
                {feedback && (
                    <Alert
                        severity={feedback.type}
                        onClose={() => setFeedback(null)}
                        sx={{ mb: 2 }}
                    >
                        {feedback.message}
                    </Alert>
                )}

                {renderTabs()}

                <Box
                    sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                    }}
                >
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button variant="contained" onClick={handleUpdate}>
                        Salvar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
