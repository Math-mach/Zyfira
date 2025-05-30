import { Knex } from "knex";

export async function up(knex: Knex) {
    await knex.schema.createTableIfNotExists("users", (table) => {
        table.uuid("ID").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.text("username").notNullable();
        table.text("email").notNullable();
        table.text("password").notNullable();
        table.date("created_in").defaultTo(knex.raw("now()"));
        table.date("updated_in").nullable();
    });

    await knex.schema.createTableIfNotExists("assets", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table
            .uuid("user_id")
            .notNullable()
            .references("ID")
            .inTable("users")
            .onDelete("CASCADE");
        table.string("name").notNullable(); // Nome fácil de lembrar
        table.text("description"); // Descrição opcional (modelo, placa, etc.)
        table.date("created_at").defaultTo(knex.fn.now());
        table.date("updated_at");
    });

    await knex.schema.createTableIfNotExists(
        "scheduled_maintenances",
        (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table
                .uuid("asset_id")
                .notNullable()
                .references("id")
                .inTable("assets")
                .onDelete("CASCADE");
            table.string("title").notNullable(); // Ex: "Revisão geral"
            table.date("due_date").notNullable(); // Data prevista
            table.string("condition"); // Ex: "5000 km"
            table.boolean("resolved").defaultTo(false);
            table.date("created_at").defaultTo(knex.fn.now());
            table.date("updated_at");
        }
    );

    await knex.schema.createTableIfNotExists("maintenance_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table
            .uuid("asset_id")
            .notNullable()
            .references("id")
            .inTable("assets")
            .onDelete("CASCADE");
        table
            .uuid("scheduled_id")
            .references("id")
            .inTable("scheduled_maintenances")
            .onDelete("CASCADE");
        table.text("title");
        table.text("condition");
        table.timestamp("due_date");
        table.timestamp("completed_at").notNullable().defaultTo(knex.fn.now());
        table
            .uuid("user_id")
            .notNullable()
            .references("ID")
            .inTable("users")
            .onDelete("CASCADE");
    });
}

export async function down(knex: Knex) {
    await knex.schema.dropTableIfExists("users");
    await knex.schema.dropTableIfExists("scheduled_maintenances");
    await knex.schema.dropTableIfExists("maintenances");
    await knex.schema.dropTableIfExists("assets");
}
