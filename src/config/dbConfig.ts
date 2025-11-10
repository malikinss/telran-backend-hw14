// src/config/dbConfig.ts

import { Knex } from "knex";

export const sqliteConfig: Knex.Config = {
	client: "sqlite3",
	connection: {
		filename: process.env.SQLITE_FILE_NAME ?? "employees.sqlite",
	},
	useNullAsDefault: true,
};
