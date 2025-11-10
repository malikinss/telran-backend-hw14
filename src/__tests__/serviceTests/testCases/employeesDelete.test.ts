// src/__tests__/serviceTests/testCases/employeesDelete.test.ts

import assert from "node:assert/strict";
import service from "../../../service/bootstrap.ts";
import { stateEmployees } from "../employeesData/employeesData.ts";
import { NotFoundError } from "../../../model/errorTypes/employeeErrors.ts";

/**
 * Test cases for deleting employees.
 * @constant {Array} employeesDeleteTestCases - Array of test case objects.
 */
export const employeesDeleteTestCases = [
	{
		title: "Delete non existing employee -> throws NotFoundError",
		/**
		 * Test function to delete a non-existing employee and expect a NotFoundError.
		 * @async
		 * @function
		 * @throws {NotFoundError} When trying to delete an employee that does not exist.
		 * @example
		 * await service.deleteEmployee("kuku");
		 * // Expects a NotFoundError to be thrown.
		 * assert.rejects(
		 *   service.deleteEmployee("kuku"),
		 *   NotFoundError
		 * );
		 */
		func: async (): Promise<void> => {
			await assert.rejects(
				service.deleteEmployee("kuku"),
				NotFoundError
			);
		},
	},
	{
		title: "Delete existing employee",
		/**
		 * Test function to delete an existing employee and verify deletion.
		 * @async
		 * @function
		 * @returns {Promise<void>}
		 * @example
		 * const employee = stateEmployees[0];
		 * const res = await service.deleteEmployee(employee.id);
		 * assert.equal(res.id, employee.id);
		 * const resAdd = await service.addEmployee(employee);
		 * assert.deepEqual(res, resAdd);
		 */
		func: async (): Promise<void> => {
			const employee = stateEmployees[0];
			const res = await service.deleteEmployee(employee.id);
			assert.equal(res.id, employee.id);
			const resAdd = await service.addEmployee(employee);
			assert.deepEqual(res, resAdd);
		},
	},
];
