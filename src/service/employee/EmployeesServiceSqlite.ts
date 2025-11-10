// src/service/employee/EmployeesServiceSqlite.ts

import { Knex } from "knex";
import { registerEmployeesService } from "../registry.ts";
import { sqliteConfig } from "../../config/dbConfig.ts";
import AbstractEmployeesServiceSql from "./AbstractEmployeesServiceSql.ts";

/**
 * SQLite implementation of the EmployeesService.
 * Uses SQLite database for employee data storage and operations.
 * Extends AbstractEmployeesServiceSql to provide concrete SQLite functionality.
 * @extends AbstractEmployeesServiceSql
 * @class
 * @param {Knex.Config} config - The Knex configuration object for SQLite
 * @returns {EmployeesServiceSqlite} A new instance of EmployeesServiceSqlite
 * @example
 * const service = new EmployeesServiceSqlite(sqliteConfig);
 * await service.createTable();
 * const employees = await service.getAllEmployees();
 * console.log(employees); // Outputs array of employee objects
 */
class EmployeesServiceSqlite extends AbstractEmployeesServiceSql {
	constructor(config: Knex.Config) {
		super(config);
	}
}

/**
 * Factory function to create and initialize a new SQLite employee service instance.
 * This function is used by the registry to instantiate the service when requested.
 * It creates the table if it doesn't exist and returns the service instance.
 * @function sqliteFactory
 * @memberof EmployeesServiceSqlite
 * @example
 * const service = await sqliteFactory();
 * console.log(service); // Outputs initialized SQLite service instance
 * @throws {Error} If table creation fails or database connection issues occur
 * @returns {Promise<EmployeesServiceSqlite>} A promise that resolves to the initialized service instance
 */
const sqliteFactory = async (): Promise<EmployeesServiceSqlite> => {
	const serviceInstance = new EmployeesServiceSqlite(sqliteConfig);
	await serviceInstance.createTable();
	return serviceInstance;
};

registerEmployeesService("sqlite", sqliteFactory);
