// src/__tests__/serviceTests/testCases/employeesUpdate.test.ts

import assert from "node:assert/strict";
import service from "../../../service/bootstrap.ts";
import { stateEmployees } from "../employeesData/employeesData.ts";
import { NotFoundError } from "../../../model/errorTypes/employeeErrors.ts";

const value = { salary: 30000 };
const wrongId = "kuku";

/**
 * Test cases for updating employees.
 * @constant {Array} employeesUpdateTestCases - Array of test case objects.
 */
export const employeesUpdateTestCases = [
	{
		title: "Update non existing employee -> throws NotFoundError",
		/**
		 * Test function to update a non-existing employee and expect a NotFoundError.
		 * @async
		 * @function
		 * @returns {Promise<void>}
		 * @throws {NotFoundError} When trying to update an employee that does not exist.
		 * @example
		 * await service.updateEmployee("kuku", { salary: 30000 });
		 * // Expects a NotFoundError to be thrown.
		 * assert.rejects(
		 *   service.updateEmployee("kuku", { salary: 30000 }),
		 *   NotFoundError
		 * );
		 */
		func: async (): Promise<void> => {
			await assert.rejects(
				service.updateEmployee(wrongId, value),
				NotFoundError
			);
		},
	},
	{
		title: "Update existing employee -> returns employee with updated salary value",
		/**
		 * Test function to update an existing employee and expect the updated employee to be returned.
		 * @async
		 * @function
		 * @returns {Promise<void>}
		 * @example
		 * const employee = stateEmployees[0];
		 * const res = await service.updateEmployee(employee.id, { salary: 30000 });
		 * assert.deepEqual(res, { ...employee, salary: 30000 });
		 */
		func: async (): Promise<void> => {
			const employee = stateEmployees[0];
			const res = await service.updateEmployee(employee.id, value);
			assert.deepEqual(res, { ...employee, ...value });
		},
	},
];
