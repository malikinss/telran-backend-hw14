// src/__tests__/serviceTests/testCases/employeesGet.test.ts

import _ from "lodash";
import assert from "node:assert/strict";
import service from "../../../service/bootstrap.ts";
import { stateEmployees } from "../employeesData/employeesData.ts";
import { NotFoundError } from "../../../model/errorTypes/employeeErrors.ts";

/**
 * Test cases for getting employees.
 * @constant {Array} employeesGetTestCases - Array of test case objects.
 */
export const employeesGetTestCases = [
	{
		title: "Get non existing employee by ID -> throws NotFoundError",
		/**
		 * Test function to get a non-existing employee by ID and expect a NotFoundError.
		 * @async
		 * @function
		 * @returns {Promise<void>}
		 * @throws {NotFoundError} When trying to get an employee that does not exist.
		 * @example
		 * await service.getEmployee("kuku");
		 * // Expects a NotFoundError to be thrown.
		 * assert.rejects(
		 *   service.getEmployee("kuku"),
		 *   NotFoundError
		 * );
		 */
		func: async (): Promise<void> => {
			await assert.rejects(service.getEmployee("kuku"), NotFoundError);
		},
	},
	{
		title: "Get all employee objects -> returns all state employees",
		/**
		 * Test function to get all employee objects and expect them to match the state employees.
		 * @async
		 * @function
		 * @returns {Promise<void>}
		 * @example
		 * const res = await service.getAll();
		 * compareArraysById(res, stateEmployees);
		 */
		func: async (): Promise<void> => {
			const res = await service.getAll();
			compareArraysById(res, stateEmployees);
		},
	},
	{
		title: "Get all employees by department -> filters correctly",
		/**
		 * Test function to get all employees by department and expect the correct employees to be returned.
		 * @async
		 * @function
		 * @returns {Promise<void>}
		 * @example
		 * let res = await service.getAll("QA");
		 * compareArraysById(res, stateEmployees.slice(0, 2));
		 * res = await service.getAll("Development");
		 * compareArraysById(res, stateEmployees.slice(2));
		 * res = await service.getAll("kuku");
		 * assert.ok(_.isArray(res) && _.isEmpty(res));
		 */
		func: async (): Promise<void> => {
			let res = await service.getAll("QA");
			compareArraysById(res, stateEmployees.slice(0, 2));

			res = await service.getAll("Development");
			compareArraysById(res, stateEmployees.slice(2));

			res = await service.getAll("kuku");
			assert.ok(_.isArray(res) && _.isEmpty(res));
		},
	},
	{
		title: "Get existing employee -> returns employee",
		/**
		 * Test function to get an existing employee and expect the correct employee to be returned.
		 * @async
		 * @function
		 * @returns {Promise<void>}
		 * @example
		 * const employee = stateEmployees[0];
		 * const res = await service.getEmployee(employee.id);
		 * assert.deepEqual(res, employee);
		 */
		func: async (): Promise<void> => {
			const employee = stateEmployees[0];
			const res = await service.getEmployee(employee.id);
			assert.deepEqual(res, employee);
		},
	},
];

/**
 * Order an array of objects by their ID.
 * @function
 * @param {Array} arr - The array to order.
 * @returns {Array} - The ordered array.
 */
function orderById(arr: any[]): any[] {
	return _.orderBy(arr, "id");
}

/**
 * Compare two arrays of employee objects by their IDs.
 * @function
 * @param {Array} arr1 - The first array to compare.
 * @param {Array} arr2 - The second array to compare.
 * @returns {void}
 */
function compareArraysById(arr1: any[], arr2: any[]): void {
	const sortedArr1 = orderById(arr1);
	const sortedArr2 = orderById(arr2);
	assert.deepEqual(sortedArr1, sortedArr2);
}
