import dotenv from "dotenv";
dotenv.config();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const JWT_SECRET: string = process.env.JWT_SECRET || "supersecreto";
const SALT_ROUNDS: number = process.env.SALT_ROUNDS
    ? parseInt(process.env.SALT_ROUNDS)
    : 6;
const DATABASE_URL: string = process.env.DBSTORAGE as string;

export { PORT, JWT_SECRET, SALT_ROUNDS, DATABASE_URL };
