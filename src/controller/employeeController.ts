// src/controller/employeeController.ts

import { Request, Response, NextFunction } from "express";
import service from "../service/bootstrap.ts";
import { Employee } from "../model/dtoTypes/Employee.ts";
import logger from "../utils/logger.ts";

const logPrefix = "[EmployeeController]";
const messages = {
	getAll: {
		start: `${logPrefix} ℹ️  Fetching all employees`,
		success: (emplNum) => `${logPrefix} ✅  Found ${emplNum} employees`,
	},
	create: {
		start: `${logPrefix} ℹ️  Creating employee`,
		success: (id) => `${logPrefix} ✅  Employee created with id: ${id}`,
	},
	update: {
		start: `${logPrefix} ℹ️  Updating employee`,
		success: (id) => `${logPrefix} ✅  Employee updated: ${id}`,
	},
	delete: {
		start: `${logPrefix} ℹ️  Deleting employee`,
		success: (id) => `${logPrefix} ✅  Employee deleted: ${id}`,
	},
};

/**
 * Get all employees, optionally filtered by department.
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @returns Promise<void>
 * @example
 * GET /api/employees?department=Sales
 * @throws {Error} - If an unexpected error occurs
 * @returns {Employee[]} - Array of employee objects
 * @exampleResponse
 * [
 *   { "id": "1", "fullName": "John Doe", "avatar": "http://example.com/avatar.jpg", "department": "Sales", "birthDate": "1990-01-01", "salary": 50000 },
 *   { "id": "2", "fullName": "Jane Smith", "avatar": "http://example.com/avatar2.jpg", "department": "Sales", "birthDate": "1985-05-15", "salary": 60000 }
 * ]
 */
async function getAllEmployees(
	req: Request,
	res: Response,
	_: NextFunction
): Promise<void> {
	const department =
		typeof req.query.department === "string"
			? req.query.department
			: undefined;
	logger.debug(messages.getAll.start, { department });
	const employees: Employee[] = await service.getAll(department);
	logger.info(messages.getAll.success(employees.length));
	res.status(200).json(employees);
}

/**
 * Create a new employee.
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @returns Promise<void>
 * @example
 * POST /api/employees
 * @throws {Error} - If an unexpected error occurs
 * @returns {Employee} - The created employee object
 * @exampleResponse
 * { "id": "1", "fullName": "John Doe", "avatar": "http://example.com/avatar.jpg", "department": "Sales", "birthDate": "1990-01-01", "salary": 50000 }
 */
async function createEmployee(
	req: Request,
	res: Response,
	_: NextFunction
): Promise<void> {
	const newEmployee: Employee = req.body as Employee;
	logger.debug(messages.create.start, {
		fullName: newEmployee.fullName,
		department: newEmployee.department,
	});
	const addedEmployee: Employee = await service.addEmployee(newEmployee);
	logger.info(messages.create.success(addedEmployee.id));
	res.status(201).json(addedEmployee);
}

/**
 * Update an existing employee partially.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @returns Promise<void>
 * @example
 * PATCH /api/employees/:id
 * @throws {NotFoundError} - If the employee with the specified ID is not found
 * @returns {Employee} - The updated employee object
 * @exampleResponse
 * { "id": "1", "fullName": "John Doe", "avatar": "http://example.com/avatar.jpg", "department": "Marketing", "birthDate": "1990-01-01", "salary": 55000 }
 */
async function updateEmployee(
	req: Request,
	res: Response,
	_: NextFunction
): Promise<void> {
	const id: string = req.params.id;
	logger.debug(messages.update.start, { id, updates: req.body });
	const updated: Employee | null = await service.updateEmployee(
		id,
		req.body as Partial<Employee>
	);
	logger.info(messages.update.success(updated?.id));
	res.status(200).json(updated);
}

/**
 * Delete an employee by ID.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function
 * @returns Promise<void>
 * @example
 * DELETE /api/employees/:id
 * @throws {NotFoundError} - If the employee with the specified ID is not found
 * @returns {Employee} - The deleted employee object
 * @exampleResponse
 * { "id": "1", "fullName": "John Doe", "avatar": "http://example.com/avatar.jpg", "department": "Sales", "birthDate": "1990-01-01", "salary": 50000 }
 */
async function deleteEmployee(
	req: Request,
	res: Response,
	_: NextFunction
): Promise<void> {
	const id: string = req.params.id;
	logger.debug(messages.delete.start, { id });
	const deleted: Employee | null = await service.deleteEmployee(id);
	logger.info(messages.delete.success(deleted?.id));
	res.status(200).json(deleted);
}

// Exporting the controller functions
export { getAllEmployees, createEmployee, updateEmployee, deleteEmployee };
