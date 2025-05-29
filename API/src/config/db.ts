import knex from "knex";
import configKnex from "../knexfile";

const db = knex(configKnex);

export default db;
