// src/__tests__/serviceTests/EmployeesService.test.ts

import _ from "lodash";
import test, { beforeEach, after } from "node:test";
import {
	resetTestEmployees,
	saveTestEmployees,
} from "./utils/setupTestEnv.ts";
import { employeesGetTestCases } from "./testCases/employeesGet.test.ts";
import { employeesAddTestCases } from "./testCases/employeesAdd.test.ts";
import { employeesUpdateTestCases } from "./testCases/employeesUpdate.test.ts";
import { employeesDeleteTestCases } from "./testCases/employeesDelete.test.ts";

// Group test cases by operation
const testCases = {
	get: employeesGetTestCases,
	add: employeesAddTestCases,
	update: employeesUpdateTestCases,
	delete: employeesDeleteTestCases,
};

// Run tests for each group of test cases
for (const [_, cases] of Object.entries(testCases)) {
	doTests(cases);
}

/**
 * Runs a series of test cases.
 * @param testCases Array of test cases to run
 * @returns void
 * @throws Will throw an error if any test case fails
 * @example
 * doTests([
 *   { title: "Test case 1", func: async () => { ... } },
 *   { title: "Test case 2", func: async () => { ... } }
 * ]);
 */
function doTests(testCases: any[]): void {
	after(saveTestEmployees);
	beforeEach(resetTestEmployees);
	for (let i = 0; i < testCases.length; i++) {
		const prefix = "Test " + (i + 1) + ": ";
		const tc = testCases[i];
		const title = prefix + tc.title;
		test(title, async () => {
			await tc.func();
		});
	}
}
