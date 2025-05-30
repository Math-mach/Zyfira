import type { Knex } from "knex";
import { DATABASE_URL } from "./config/env";
import dotenv from "dotenv";

dotenv.config();

const configKnex: Knex.Config = {
    client: "pg",
    connection: DATABASE_URL,
    migrations: {
        directory: "./src/migrations",
    },
};

export default configKnex;
