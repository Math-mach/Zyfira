import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);
const JWT_SECRET = process.env.JWT_SECRET ?? "supersecreto";
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "6", 10);

const POSTGRES_USER = process.env.POSTGRES_USER ?? "user";
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? "password";
const POSTGRES_DB = process.env.POSTGRES_DB ?? "mydb";
const POSTGRES_URL = process.env.POSTGRES_URL ?? "localhost";

const DATABASE_URL =
    process.env.DATABASE_URL ??
    `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_URL}:5432/${POSTGRES_DB}`;

if (!DATABASE_URL) {
    throw new Error("Missing environment variable: DATABASE_URL or Postgres configs");
}

export { PORT, JWT_SECRET, SALT_ROUNDS, DATABASE_URL };
