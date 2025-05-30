import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Alert,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Asset {
    id: string;
    name: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ModalAdicionarManutencaoAgendada({
    open,
    onClose,
    onSuccess,
}: Props) {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [form, setForm] = useState({
        asset_id: "",
        title: "",
        due_date: "",
        condition: "",
    });
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetch("/api/assets", { credentials: "include" })
                .then((res) => res.json())
                .then((data) => setAssets(data))
                .catch(() =>
                    setFeedback({
                        type: "error",
                        message: "Erro ao carregar ativos.",
                    })
                );
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setFeedback(null);
        try {
            const res = await fetch("/api/scheduled", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Erro ao adicionar manutenção");

            setFeedback({
                type: "success",
                message: "Manutenção agendada com sucesso",
            });
            setForm({ asset_id: "", title: "", due_date: "", condition: "" });
            onSuccess?.();
            onClose();
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Erro ao adicionar manutenção";
            setFeedback({ type: "error", message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Agendar Manutenção</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        select
                        label="Ativo"
                        name="asset_id"
                        value={form.asset_id}
                        onChange={handleChange}
                        required
                    >
                        {assets.map((asset) => (
                            <MenuItem key={asset.id} value={asset.id}>
                                {asset.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Título"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Data prevista"
                        name="due_date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={form.due_date}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Condição (ex: 5000 km)"
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                    />
                    {feedback && (
                        <Alert
                            severity={feedback.type}
                            onClose={() => setFeedback(null)}
                        >
                            {feedback.message}
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
