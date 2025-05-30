import {
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import EditAssetModal from "../components/EditAssetModal";

type Asset = {
    id: string;
    name: string;
    description: string;
    created_at: string;
};

import AddAssetModal from "../components/AddAssets";

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const fetchAssets = async () => {
        try {
            const res = await fetch("/api/assets", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Erro ao buscar ativos");

            const data = await res.json();
            setAssets(data);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Erro desconhecido ao buscar ativos";
            setFeedback({ type: "error", message });
        } finally {
            setLoading(false);
        }
    };

    const deleteAsset = async (id: string) => {
        try {
            const res = await fetch(`/api/assets/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Erro ao deletar ativo");

            setAssets((prev) => prev.filter((asset) => asset.id !== id));
            setFeedback({
                type: "success",
                message: "Ativo deletado com sucesso",
            });
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Erro desconhecido ao deletar o ativo";
            setFeedback({ type: "error", message });
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return (
        <Container>
            <Typography variant="h5" gutterBottom>
                Todos os Ativos
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Data de Criação</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assets.map((asset) => (
                                <TableRow key={asset.id}>
                                    <TableCell>{asset.name}</TableCell>
                                    <TableCell>
                                        {asset.description || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            asset.created_at
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() =>
                                                setSelectedAsset(asset)
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                deleteAsset(asset.id)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <EditAssetModal
                open={!!selectedAsset}
                asset={selectedAsset}
                onClose={() => setSelectedAsset(null)}
                onUpdated={() => {
                    fetchAssets();
                    setSelectedAsset(null);
                }}
            />

            <Snackbar
                open={!!feedback}
                autoHideDuration={4000}
                onClose={() => setFeedback(null)}
            >
                {feedback ? (
                    <Alert
                        severity={feedback.type}
                        onClose={() => setFeedback(null)}
                        variant="filled"
                    >
                        {feedback.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
            <AddAssetModal />
        </Container>
    );
}
