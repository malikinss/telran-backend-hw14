// src/service/employee/EmployeeServiceMock.test.ts

import EmployeesService from "./EmployeesService.ts";
import { Employee } from "../../model/dtoTypes/Employee.ts";
import { registerEmployeesService } from "../registry.ts";

const FACTORY_KEY = "mock";

/**
 * Mock implementation of EmployeesService for testing purposes.
 * This class simulates the behavior of a real employee service,
 * allowing tests to run without depending on external systems.
 *
 * @implements {EmployeesService}
 * @example
 * const service = new EmployeesServiceMock();
 * const employees = await service.getAll();
 * console.log(employees); // Outputs: []
 */
export default class EmployeesServiceMock implements EmployeesService {
	async getAll(department?: string): Promise<Employee[]> {
		return [];
	}

	async getEmployee(id: string): Promise<Employee> {
		return {} as Employee;
	}

	async addEmployee(empl: Employee): Promise<Employee> {
		return {} as Employee;
	}

	async updateEmployee(
		id: string,
		empl: Partial<Employee>
	): Promise<Employee> {
		return {} as Employee;
	}

	async deleteEmployee(id: string): Promise<Employee> {
		return {} as Employee;
	}

	async save(): Promise<void> {
		// Mock implementation - no actual save needed
	}
}

// Register the mock service for dependency injection
registerEmployeesService(FACTORY_KEY, async (_) => new EmployeesServiceMock());
