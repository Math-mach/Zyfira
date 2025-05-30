import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);
const JWT_SECRET = process.env.JWT_SECRET ?? "supersecreto";
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "6", 10);
const DATABASE_URL = process.env.DBSTORAGE;

if (!DATABASE_URL) {
    throw new Error("Missing environment variable: DBSTORAGE");
}

export { PORT, JWT_SECRET, SALT_ROUNDS, DATABASE_URL };
