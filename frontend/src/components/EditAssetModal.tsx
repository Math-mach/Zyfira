import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";

type Props = {
    open: boolean;
    asset: {
        id: string;
        name: string;
        description: string;
    } | null;
    onClose: () => void;
    onUpdated: () => void;
};

export default function EditAssetModal({
    open,
    asset,
    onClose,
    onUpdated,
}: Props) {
    const [form, setForm] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (asset) {
            setForm({ name: asset.name, description: asset.description || "" });
        }
    }, [asset]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (!asset) return;

        try {
            setLoading(true);

            const res = await fetch(`/api/assets/${asset.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Erro ao atualizar ativo");

            onUpdated();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Editar Ativo</DialogTitle>
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
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Descrição"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                    />
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
                    {loading ? <CircularProgress size={20} /> : "Salvar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
