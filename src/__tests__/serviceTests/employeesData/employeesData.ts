// src/__tests__/serviceTests/employeesData/employeesData.ts

import { Employee } from "../../../model/dtoTypes/Employee.ts";
import { v4 as uuidv4 } from "uuid";

/**
 * Predefined IDs for testing purposes.
 * @constant {string[]} ids - Array of unique employee IDs.
 * @example
 * const id: string = ids[0];
 */
export const ids: string[] = Array.from({ length: 4 }, () => uuidv4());

/**
 * Predefined state of employees for testing purposes.
 * @constant {Employee[]} stateEmployees - Array of Employee objects.
 * @example
 * const employee: Employee = {
 *   id: "123",
 *  fullName: "John Doe",
 *  avatar: "https://example.com/avatar.jpg",
 *  department: "Engineering",
 *  birthDate: "1990-01-01",
 *  salary: 60000
 * };
 */
export const stateEmployees: Employee[] = [
	{
		id: ids[0],
		avatar: "",
		salary: 10000,
		birthDate: "2000-01-01",
		department: "QA",
		fullName: "Full Name",
	},
	{
		id: ids[1],
		avatar: "",
		salary: 10000,
		birthDate: "2000-01-01",
		department: "QA",
		fullName: "Full Name",
	},
	{
		id: ids[2],
		avatar: "",
		salary: 10000,
		birthDate: "2000-01-01",
		department: "Development",
		fullName: "Full Name",
	},
	{
		id: ids[3],
		avatar: "",
		salary: 10000,
		birthDate: "2000-01-01",
		department: "Development",
		fullName: "Full Name",
	},
];
