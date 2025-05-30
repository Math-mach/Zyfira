import { PORT } from "./config/env";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes";

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
