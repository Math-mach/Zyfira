import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const configKnex: Knex.Config = {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
        directory: "./migrations",
    },
};

export default configKnex;
