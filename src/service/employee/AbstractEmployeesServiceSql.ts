// src/service/employee/AbstractEmployeesServiceSql.ts

import { Employee } from "../../model/dtoTypes/Employee.ts";
import EmployeesService from "./EmployeesService.ts";
import knex, { Knex } from "knex";
import { TABLE_NAME, createEmployeesTable } from "./EmployeesTableSchema.js";
import { v4 as uuidv4 } from "uuid";
import {
	AlreadyExistsError,
	NotFoundError,
} from "../../model/errorTypes/employeeErrors.ts";

/**
 * AbstractEmployeesServiceSql provides a base implementation for employee management using SQL databases.
 * It uses Knex.js for database operations and implements the EmployeesService interface.
 *
 * @class AbstractEmployeesServiceSql
 * @implements EmployeesService
 * @example
 * const config: Knex.Config = {
 *   client: 'sqlite3',
 *   connection: { filename: './employees.db' }
 * };
 * const service = new ConcreteEmployeesServiceSql(config);
 * await service.createTable();
 * const employees = await service.getAll();
 * console.log(employees);
 */
abstract class AbstractEmployeesServiceSql implements EmployeesService {
	private db: Knex;

	constructor(config: Knex.Config) {
		this.db = knex(config);
	}

	/**
	 * Creates the employees table if it does not already exist.
	 * @returns A promise that resolves when the table is created.
	 *
	 * @example
	 * await service.createTable();
	 */
	async createTable() {
		const exists = await this.db.schema.hasTable(TABLE_NAME);
		if (!exists) {
			await this.db.schema.createTable(TABLE_NAME, createEmployeesTable);
		}
	}

	/**
	 * Adds a new employee.
	 * If the employee ID is not provided, a new UUID is generated.
	 * @param empl - The employee object to add
	 * @returns {Promise<Employee>}
	 * @throws {AlreadyExistsError} - If an employee with the same ID already exists.
	 * @example
	 * const newEmployee = await service.addEmployee({
	 *   fullName: "John Doe",
	 *   avatar: "https://example.com/avatar.jpg",
	 *   department: "Engineering",
	 *   birthDate: "1990-01-01",
	 *   salary: 60000
	 * });
	 * console.log(newEmployee);
	 */
	async addEmployee(empl: Employee): Promise<Employee> {
		const id: string = empl.id ?? uuidv4();
		const newEmployee = { ...empl, id };

		const exists = await this.employeeQuery(id).first();
		if (exists) {
			throw new AlreadyExistsError(id);
		}
		await this.db<Employee>(TABLE_NAME).insert(newEmployee);
		return newEmployee;
	}

	/**
	 * Retrieves all employees, optionally filtered by department.
	 * @param department - Optional department to filter employees by
	 * @returns {Promise<Employee[]>} - Array of employees
	 * @example
	 * const allEmployees = await service.getAll();
	 * const engineeringEmployees = await service.getAll("Engineering");
	 * console.log(allEmployees);
	 * console.log(engineeringEmployees);
	 */
	async getAll(department?: string): Promise<Employee[]> {
		let query = this.db<Employee>(TABLE_NAME);
		if (department) {
			query = query.where({ department });
		}
		return await query;
	}

	/**
	 * Updates an existing employee with the specified ID using the provided partial employee data.
	 *
	 * @param id - The ID of the employee to update.
	 * @param empl - Partial employee object containing the fields to update.
	 * @returns {Promise<Employee>} - The updated employee object.
	 * @throws {NotFoundError} - If no employee with the given ID exists.
	 * @example
	 * const updatedEmployee = await service.updateEmployee("123", {
	 *   salary: 65000,
	 *   department: "Marketing"
	 * });
	 * console.log(updatedEmployee);
	 */
	async updateEmployee(
		id: string,
		empl: Partial<Employee>
	): Promise<Employee> {
		const existing = await this.getEmployee(id);
		await this.employeeQuery(id).update(empl);
		return { ...existing, ...empl };
	}

	/**
	 * Deletes an employee by ID.
	 * @param id - The ID of the employee to delete.
	 * @returns {Promise<Employee>} - The deleted employee object.
	 * @throws {NotFoundError} - If no employee with the given ID exists.
	 * @example
	 * const deletedEmployee = await service.deleteEmployee("123");
	 * console.log(deletedEmployee);
	 */
	async deleteEmployee(id: string): Promise<Employee> {
		const empl = await this.getEmployee(id);
		await this.employeeQuery(id).delete();
		return empl;
	}

	/**
	 * Retrieves an employee by ID.
	 * @param id - The ID of the employee to retrieve.
	 * @returns {Promise<Employee>} - The employee object.
	 * @throws {NotFoundError} - If no employee with the given ID exists.
	 * @example
	 * const employee = await service.getEmployee("123");
	 * console.log(employee);
	 */
	async getEmployee(id: string): Promise<Employee> {
		const res = await this.employeeQuery(id).first();
		if (!res) {
			throw new NotFoundError(id);
		}
		return res;
	}

	/**
	 * Saves any pending changes and closes the database connection.
	 * @returns {Promise<void>} - A promise that resolves when the connection is closed.
	 * @example
	 * await service.save();
	 */
	async save(): Promise<void> {
		await this.db.destroy();
	}

	/**
	 * Helper method to create a query for an employee by ID.
	 * This method is used internally to build queries for employee operations.
	 *
	 * @param id - The ID of the employee to query for.
	 * @returns {Knex.QueryBuilder<Employee, Employee[]>} - A Knex query builder for the employee with the specified ID.
	 * @example
	 * const query = this.employeeQuery("123");
	 * const employees = await query.select();
	 * console.log(employees);
	 */
	private employeeQuery(
		id: string
	): Knex.QueryBuilder<Employee, Employee[]> {
		return this.db<Employee>(TABLE_NAME).where({ id });
	}
}

export default AbstractEmployeesServiceSql;
