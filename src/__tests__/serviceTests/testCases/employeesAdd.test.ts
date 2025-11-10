// src/__tests__/serviceTests/testCases/employeesAdd.test.ts

import assert from "node:assert/strict";
import service from "../../../service/bootstrap.ts";
import { stateEmployees } from "../employeesData/employeesData.ts";
import { AlreadyExistsError } from "../../../model/errorTypes/employeeErrors.ts";

/**
 * Test cases for adding employees.
 * @constant {Array} employeesAddTestCases - Array of test case objects.
 */
export const employeesAddTestCases = [
	{
		title: "Add existing employee -> throws AlreadyExistsError",
		/**
		 * Test function to add an existing employee and expect an AlreadyExistsError.
		 * @async
		 * @function
		 * @returns {Promise<void>}
		 * @throws {AlreadyExistsError} When trying to add an employee that already exists.
		 * @example
		 * await service.addEmployee(existingEmployee);
		 * // Expects an AlreadyExistsError to be thrown.
		 * assert.rejects(
		 *   service.addEmployee(existingEmployee),
		 *   AlreadyExistsError
		 * );
		 */
		func: async (): Promise<void> => {
			await assert.rejects(
				service.addEmployee(stateEmployees[0]),
				AlreadyExistsError
			);
		},
	},
	{
		title: "Add new employee object with no id -> returns added object with id",
		/**
		 * Test function to add a new employee without an ID and expect the returned object to have an ID.
		 * @async
		 * @function
		 * @returns {Promise<void>}
		 * @throws {AssertionError} When the returned object does not have an ID.
		 * @example
		 * await service.addEmployee({
		 *   avatar: "",
		 *   salary: 10000,
		 *   birthDate: "2000-01-01",
		 *   department: "QA",
		 *   fullName: "Full Name",
		 * });
		 * // Expects the result to have a generated ID.
		 * assert.ok(result.id);
		 */
		func: async (): Promise<void> => {
			const result = await service.addEmployee({
				avatar: "",
				salary: 10000,
				birthDate: "2000-01-01",
				department: "QA",
				fullName: "Full Name",
			});
			assert.ok(result.id);
		},
	},
];
