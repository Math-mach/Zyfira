import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

export const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            (isLogin && (!email.trim() || !password.trim())) ||
            (!isLogin &&
                (!username.trim() || !email.trim() || !password.trim()))
        ) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const url = isLogin ? "/api/login" : "/api/register";
            const payload = isLogin
                ? { email, password }
                : { username, email, password };

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(
                    `Erro de ${isLogin ? "login" : "registro"}:`,
                    errorData.error
                );
                alert(
                    `${isLogin ? "Login" : "Registro"} falhou: ` +
                        errorData.error
                );
                return;
            }

            const data = await response.json();
            console.log(data);
            localStorage.setItem("token", data.token);
        } catch (err) {
            console.error("Erro de rede:", err);
            alert("Erro de conexão com o servidor.");
        }

        setUsername("");
        setEmail("");
        setPassword("");
    };

    return (
        <Container
            sx={{
                minHeight: "100vh",
                minWidth: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 30%, #764ba2 90%)",
                padding: 4,
            }}
        >
            <Box
                sx={{
                    width: { xs: "90%", sm: "60%" },
                    minHeight: "577px",
                    borderRadius: 3,
                    boxShadow: 6,
                    overflow: "hidden",
                    display: "flex",
                    bgcolor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    color: "#fff",
                }}
            >
                <Box
                    sx={{
                        display: { xs: "none", sm: "block" },
                        flex: "1.5 2.5",
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                    }}
                    aria-hidden="true"
                >
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(135deg, rgba(102, 126, 234, 0.75) 30%, rgba(118, 75, 162, 0.85) 70%)",
                        }}
                    />
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        flex: "1 2",
                        p: { xs: 4, md: 6 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Typography
                        variant="h4"
                        textAlign="center"
                        mb={4}
                        sx={{ textShadow: "0 0 8px rgba(138,43,226,0.7)" }}
                    >
                        {isLogin ? "Login" : "Registro"}
                    </Typography>

                    {!isLogin && (
                        <TextField
                            label="Nome"
                            variant="filled"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                            sx={{
                                bgcolor: "rgba(255, 255, 255, 0.15)",
                                "& .MuiInputBase-input": {
                                    color: "#fff",
                                },
                                "& .MuiInputLabel-root": {
                                    color: "rgba(255,255,255,0.5)",
                                },
                                "& .Mui-focused .MuiInputLabel-root": {
                                    color: "#8a2be2",
                                },
                                borderRadius: 1.25,
                            }}
                            margin="normal"
                        />
                    )}

                    <TextField
                        label=" Email"
                        variant="filled"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.15)",
                            "& .MuiInputBase-input": {
                                color: "#fff",
                            },
                            "& .MuiInputLabel-root": {
                                color: "rgba(255,255,255,0.5)",
                            },
                            "& .Mui-focused .MuiInputLabel-root": {
                                color: "#8a2be2",
                            },
                            borderRadius: 1.25,
                        }}
                        margin="normal"
                    />

                    <TextField
                        label="Senha"
                        type="password"
                        variant="filled"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        margin="normal"
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.15)",
                            "& .MuiInputBase-input": {
                                color: "#fff",
                            },
                            "& .MuiInputLabel-root": {
                                color: "rgba(255,255,255,0.5)",
                            },
                            "& .Mui-focused .MuiInputLabel-root": {
                                color: "#8a2be2",
                            },
                            borderRadius: 1.25,
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="medium"
                        sx={{
                            bgcolor: "#8a2be2",
                            fontWeight: 600,
                            fontSize: 18,
                            "&:hover": {
                                bgcolor: "#6a1fb6",
                                boxShadow: "0 8px 24px rgba(106, 31, 182, 0.7)",
                            },
                            py: 2,
                            borderRadius: 2,
                        }}
                    >
                        {isLogin ? "Entrar" : "Registrar"}
                    </Button>

                    <Typography
                        variant="caption"
                        color="rgba(255,255,255,0.7)"
                        align="center"
                        mt={3}
                    >
                        {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                        <Button
                            onClick={() => setIsLogin(!isLogin)}
                            sx={{
                                color: "#8a2be2",
                                textDecoration: "underline",
                            }}
                        >
                            {isLogin ? "Registrar" : "Entrar"}
                        </Button>
                    </Typography>

                    <Typography
                        variant="caption"
                        color="rgba(255,255,255,0.7)"
                        align="center"
                        mt={3}
                    >
                        © {new Date().getFullYear()} Zyfira
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};
