// src/service/employee/EmployeesService.ts

import { Employee } from "../../model/dtoTypes/Employee.ts";

/**
 * Service interface for managing employees.
 * Provides methods to get, add, update, and delete employees.
 * @interface EmployeesService
 * @method getAll - Retrieves all employees, optionally filtered by department.
 * @method addEmployee - Adds a new employee.
 * @method updateEmployee - Updates an existing employee by ID.
 * @method deleteEmployee - Deletes an employee by ID.
 * @returns {Employee | Employee[] | null} - Returns the employee(s) or null if not found.
 * @throws {Error} - Throws an error if the operation fails.
 * @example
 * const service: EmployeesService = ...;
 * const allEmployees = service.getAll();
 * const newEmployee = service.addEmployee({ name: "John Doe", department: "HR" });
 * const updatedEmployee = service.updateEmployee("123", { department: "Finance" });
 * const deletedEmployee = service.deleteEmployee("123");
 */
export default interface EmployeesService {
	/**
	 * Retrieves all employees, optionally filtered by department.
	 * @param department - Optional department to filter employees by.
	 * @returns {Promise<Employee[]>} - Promise resolving to an array of Employee objects.
	 * @example
	 * const employees = await service.getAll("Sales");
	 * const allEmployees = await service.getAll();
	 * @throws {Error} - If the retrieval fails.
	 * @exampleResponse
	 * [ { "id": "1", "fullName": "John Doe", "avatar": "http://example.com/avatar.jpg", "department": "Sales", "birthDate": "1990-01-01", "salary": 50000 } ]
	 */
	getAll(department?: string): Promise<Employee[]>;

	/**
	 * Retrieves an employee by ID.
	 * @param id - ID of the employee to retrieve.
	 * @returns {Promise<Employee>} - Promise resolving to the Employee object.
	 * @example
	 * const employee = await service.getEmployee("123");
	 */
	getEmployee(id: string): Promise<Employee>;

	/**
	 * Adds a new employee.
	 * @param empl - Employee object to add.
	 * @returns {Promise<Employee>} The added employee object.
	 * @example
	 * const newEmployee = await service.addEmployee({ fullName: "Jane Doe", department: "Marketing" });
	 * @throws {Error} If the addition fails.
	 * @exampleResponse
	 * { "id": "2", "fullName": "Jane Doe", "avatar": "http://example.com/avatar2.jpg", "department": "Marketing", "birthDate": "1992-02-02", "salary": 60000 }
	 */
	addEmployee(empl: Employee): Promise<Employee>;

	/** Updates an existing employee by ID.
	 * @param {string} id - ID of the employee to update.
	 * @param {Partial<Employee>} empl - Partial employee object with fields to update.
	 * @return {Employee} - The updated employee.
	 * @throws {Error} - Throws an error if the employee with the given ID does not exist.
	 */
	updateEmployee(id: string, empl: Partial<Employee>): Promise<Employee>;

	/** Deletes an employee by ID.
	 * @param {string} id - ID of the employee to delete.
	 * @returns {Employee} - The deleted employee.
	 * @throws {Error} - Throws an error if the employee with the given ID does not exist.
	 */
	deleteEmployee(id: string): Promise<Employee>;

	/**
	 * Saves the current state of employees to the data source.
	 * @returns {Promise<void>} - Promise that resolves when the save operation is complete.
	 * @throws {Error} - Throws an error if the save operation fails.
	 * @example
	 * await service.save();
	 */
	save(): Promise<void>;
}
