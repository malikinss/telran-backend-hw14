// src/service/employee/EmployeesServiceMap.ts

/**
 * @module EmployeesServiceMap
 */

import { v4 as uuidv4 } from "uuid";
import { Employee } from "../../model/dtoTypes/Employee.ts";
import EmployeesService from "./EmployeesService.ts";
import { fileStorage } from "../../utils/fileStorage.ts";
import { registerEmployeesService } from "../registry.ts";
import {
	AlreadyExistsError,
	NotFoundError,
} from "../../model/errorTypes/employeeErrors.ts";
import logger from "../../utils/logger.ts";

const logPrefix = "[EmployeeService]";

const messages = {
	loading: (size: number) =>
		`${logPrefix} ✅  Loaded ${size} employees from file`,
	fill: (employee: string) =>
		`${logPrefix} ⚠️  Skipping employee without ID: ${employee}`,
};

const FACTORY_KEY = "map";

/**
 * In-memory implementation of EmployeesService using a Map.
 * Provides methods to add, get, update, and delete employees.
 * Loads initial data from file storage.
 * @implements EmployeesService
 */
class EmployeesServiceMap implements EmployeesService {
	private _employees: Map<string, Employee> = new Map();
	private _isUpdated: boolean;

	constructor(isUpdated = false) {
		this._isUpdated = isUpdated;
		this._loadFromFile();
	}

	/**
	 * Loads employees from file storage and fills the map.
	 * Initializes the service by loading employees from a file.
	 * @private
	 * @returns {void}
	 */
	private _loadFromFile(): void {
		const loaded = fileStorage.loadEmployees();
		this._fillEmployeeMap(loaded);
		logger.debug(messages.loading(this._employees.size));
	}

	/**
	 * Fills the employee map with the provided array of employees.
	 * Skips employees without an ID and logs a warning.
	 * @param employees - Array of Employee objects to load into the map.
	 */
	private _fillEmployeeMap(employees: Employee[]): void {
		this._employees.clear();
		for (const employee of employees) {
			if (employee.id) {
				this._employees.set(employee.id, employee);
			} else {
				logger.warn(messages.fill(JSON.stringify(employee)));
			}
		}
	}

	/**
	 * Helper method to retrieve an employee by ID or throw NotFoundError.
	 * @param id - ID of the employee to find
	 * @returns Employee object
	 * @throws {NotFoundError} If no employee exists with the given ID
	 * @private
	 */
	private _employeeById(id: string): Employee {
		const employee = this._employees.get(id);
		if (!employee) throw new NotFoundError(id);
		return employee;
	}

	/**
	 * Adds a new employee.
	 * Generates a new ID if not provided, checks for duplicates, and adds the employee to the map.
	 * @param empl - Employee object to add. If no ID is provided, a new UUID will be generated.
	 * @returns {Promise<Employee>} The added employee.
	 * @throws {AlreadyExistsError} If an employee with the same ID already exists.
	 * @throws {Error} If employee creation fails for any other reason.
	 * @example
	 * const newEmployee = await employeesService.addEmployee({
	 *   fullName: "John Doe",
	 *   avatar: "https://example.com/avatar.jpg",
	 *   department: "Engineering",
	 *   birthDate: "1990-01-01",
	 *   salary: 60000
	 * });
	 * console.log(newEmployee.id); // Outputs the new employee's ID
	 */
	async addEmployee(empl: Employee): Promise<Employee> {
		const id: string = empl.id ?? uuidv4();
		if (this._employees.has(id)) {
			throw new AlreadyExistsError(id);
		}
		empl.id = id;
		this._employees.set(id, empl);
		this._isUpdated = true;
		return empl;
	}

	/**
	 * Retrieves all employees, optionally filtered by department.
	 * @param department - Optional department to filter employees by.
	 * @returns {Promise<Employee[]>} - Array of Employee objects.
	 * @example
	 * const allEmployees = await employeesService.getAll();
	 * const engineeringEmployees = await employeesService.getAll("Engineering");
	 */
	async getAll(department?: string): Promise<Employee[]> {
		let all: Employee[] = Array.from(this._employees.values());
		if (department) {
			all = all.filter((empl) => empl.department === department);
		}
		return all;
	}

	/**
	 * Retrieves a single employee by ID.
	 * @param id - ID of the employee to retrieve
	 * @returns Employee object
	 * @throws {NotFoundError} If the employee does not exist
	 * @example
	 * const employee = await employeesService.getEmployee("123");
	 */
	async getEmployee(id: string): Promise<Employee> {
		return this._employeeById(id);
	}

	/**
	 * Updates an existing employee with the provided partial data.
	 * @param id - ID of the employee to update
	 * @param empl - Partial employee object with updated fields
	 * @returns Updated Employee object
	 * @throws {NotFoundError} If the employee does not exist
	 * @example
	 * const updated = await employeesService.updateEmployee("123", { salary: 70000 });
	 */
	async updateEmployee(
		id: string,
		empl: Partial<Employee>
	): Promise<Employee> {
		const existing = this._employeeById(id);
		Object.assign(existing, empl);
		this._isUpdated = true;
		return existing;
	}

	/**
	 * Deletes an employee by ID.
	 * @param id - ID of the employee to delete
	 * @returns Deleted Employee object
	 * @throws {NotFoundError} If the employee does not exist
	 * @example
	 * const removed = await employeesService.deleteEmployee("123");
	 */
	async deleteEmployee(id: string): Promise<Employee> {
		const existing = this._employeeById(id);
		this._employees.delete(id);
		this._isUpdated = true;
		return existing;
	}

	/**
	 * Saves current employee map to file storage if updated.
	 * @returns {void}
	 * @example
	 * await employeesService.save();
	 */
	async save(): Promise<void> {
		fileStorage.saveEmployees(this.toArray(), this._isUpdated);
	}

	/**
	 * Converts internal employee map to an array.
	 * @returns {Employee[]} Array of Employee objects
	 */
	toArray(): Employee[] {
		return Array.from(this._employees.values());
	}

	/**
	 * Returns true if employee map has been updated since last save.
	 * @returns {boolean}
	 */
	isUpdated(): boolean {
		return this._isUpdated;
	}
}

// Register service in registry
registerEmployeesService(FACTORY_KEY, async () => new EmployeesServiceMap());
