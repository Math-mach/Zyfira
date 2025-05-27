import { PORT } from "./config/env";
import express from "express";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/users";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
