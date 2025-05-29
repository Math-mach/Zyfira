import knexConfig from "../knexfile";
import { knex } from "knex";

(async () => {
    try {
        const db = knex(knexConfig);
        console.log("🔌 Testando conexão com o banco de dados...");
        await db.raw("SELECT 1+1 AS result");
        console.log("✅ Conectado com sucesso!");

        console.log("📦 Executando migrações...");
        await db.migrate.latest();
        console.log("🎉 Banco de dados inicializado com sucesso!");

        await db.destroy();
    } catch (err) {
        console.error("❌ Erro ao inicializar banco de dados:", err);
        process.exit(1);
    }
})();
