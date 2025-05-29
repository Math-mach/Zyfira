import knexConfig from "../knexfile";
import { knex } from "knex";

(async () => {
    try {
        const db = knex(knexConfig);
        console.log("🧨 Dropando todas as tabelas...");
        await db.migrate.rollback(undefined, true);
        console.log("🔁 Recriando tabelas...");
        await db.migrate.latest();
        console.log("✅ Banco de dados recriado com sucesso!");

        await db.destroy();
    } catch (err) {
        console.error("❌ Erro ao dropar/recriar banco de dados:", err);
        process.exit(1);
    }
})();
