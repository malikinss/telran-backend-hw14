// src/__tests__/serviceTests/utils/setupTestEnv.ts

import service from "../../../service/bootstrap.ts";
import { stateEmployees } from "../employeesData/employeesData.ts";
import { Employee } from "../../../model/dtoTypes/Employee.ts";

/**
 * Resets the employee data in the service to a predefined state.
 * Clears all existing employees and adds the predefined `stateEmployees`.
 *
 * @returns {Promise<void>} Resolves when all employees have been reset.
 *
 * @example
 * await resetTestEmployees();
 * const employees = await service.getAll();
 * console.log(employees); // Outputs the predefined state employees
 */
export async function resetTestEmployees(): Promise<void> {
	const existing: Employee[] = await service.getAll();
	for (const empl of existing) {
		await service.deleteEmployee(empl.id);
	}
	for (const empl of stateEmployees) {
		await service.addEmployee(empl);
	}
}

/**
 * Persists the current employee data in the service.
 * Typically used in tests to ensure that the current state is saved before assertions.
 *
 * @returns {Promise<void>} Resolves when the employee data is saved.
 *
 * @example
 * await saveTestEmployees();
 * // The current state of employees is now persisted in the service
 */
export async function saveTestEmployees(): Promise<void> {
	await service.save();
}
