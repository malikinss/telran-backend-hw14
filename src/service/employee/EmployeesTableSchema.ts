// src/service/employee/EmployeesTableSchema.ts

import { Knex } from "knex";

export const TABLE_NAME = "employees";

/**
 * Create employees table schema
 * @param table
 *
 * @example
 * createEmployeesTable(table);
 * // => creates employees table with specified columns
 */
export const createEmployeesTable = (table: Knex.CreateTableBuilder) => {
	table.string("id").primary();
	table.string("fullName").notNullable();
	table.string("avatar").defaultTo("");
	table.string("birthDate").notNullable();
	table.integer("salary").notNullable();
	table.string("department").notNullable();
	table.index(["department"]);
};
