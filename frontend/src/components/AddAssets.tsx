import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    TextField,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function AddAssetModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setFeedback({
                type: "error",
                message: "O nome do ativo é obrigatório.",
            });
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/assets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Erro ao adicionar ativo");
            }

            setFeedback({
                type: "success",
                message: "Ativo adicionado com sucesso!",
            });
            setOpen(false);
            setFormData({ name: "", description: "" });
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Erro desconhecido ao adicionar o ativo";
            setFeedback({ type: "error", message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Fab
                color="primary"
                aria-label="adicionar"
                onClick={() => setOpen(true)}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                }}
            >
                <AddIcon />
            </Fab>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Adicionar Ativo</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <TextField
                            label="Nome"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Descrição"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        startIcon={
                            loading ? <CircularProgress size={18} /> : null
                        }
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!feedback}
                autoHideDuration={4000}
                onClose={() => setFeedback(null)}
            >
                {feedback && (
                    <Alert
                        severity={feedback.type}
                        onClose={() => setFeedback(null)}
                        variant="filled"
                    >
                        {feedback.message}
                    </Alert>
                )}
            </Snackbar>
        </>
    );
}
