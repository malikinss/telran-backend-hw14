// src/service/employee/mongo/AbstractEmployeesServiceMongo.ts

import { v4 as uuidv4 } from "uuid";
import { Collection, Db, InsertOneResult, MongoClient } from "mongodb";
import { Employee } from "../../../model/dtoTypes/Employee.ts";
import EmployeesService from "../EmployeesService.ts";
import {
	AlreadyExistsError,
	NotFoundError,
} from "../../../model/errorTypes/employeeErrors.ts";

function cleanMongoDoc(doc: any): Employee {
	const { _id, ...rest } = doc;
	return rest;
}

const PLUG = { projection: { _id: 0 } };

/**
 * Abstract MongoDB-based implementation of the EmployeesService.
 *
 * This class provides a reusable data layer for managing employee entities
 * using MongoDB as the persistence layer. It encapsulates CRUD operations,
 * connection handling, and error mapping to domain-specific error types.
 *
 * Subclasses (such as in-memory or real database implementations)
 * may override specific behaviors or extend functionality as needed.
 */
abstract class AbstractEmployeesServiceMongo implements EmployeesService {
	protected client: MongoClient;
	protected db!: Db;
	protected collection!: Collection<Employee>;

	/**
	 * Constructs an abstract MongoDB employees service.
	 *
	 * @param uri - MongoDB connection URI.
	 * @param dbName - Name of the database to connect to.
	 * @param collectionName - Name of the collection where employees are stored.
	 */
	constructor(
		protected readonly uri: string,
		private readonly dbName: string,
		private readonly collectionName: string
	) {
		this.client = new MongoClient(uri);
	}

	/**
	 * Initializes the MongoDB connection and sets up indexes.
	 *
	 * Creates the collection if it doesn't exist and ensures indexes
	 * for `id` (unique) and `department` (hashed) fields.
	 *
	 * @returns A Promise that resolves when initialization is complete.
	 */
	async init(): Promise<void> {
		await this.client.connect();
		this.db = this.client.db(this.dbName);
		this.collection = this.db.collection<Employee>(this.collectionName);

		await this.collection.createIndex({ id: 1 }, { unique: true });
		await this.collection.createIndex({ department: "hashed" });
	}

	/**
	 * Adds a new employee to the collection.
	 *
	 * Automatically generates a UUID if the employee does not have an ID.
	 * Throws `AlreadyExistsError` if an employee with the same ID already exists.
	 *
	 * @param empl - The employee object to be added.
	 * @returns {Promise<Employee>} The created employee with a unique ID.
	 * @throws {AlreadyExistsError} If an employee with the same ID already exists.
	 */
	async addEmployee(empl: Employee): Promise<Employee> {
		const id = empl.id ?? uuidv4();
		const newEmployee = { ...empl, id };

		try {
			await this.collection.insertOne(newEmployee);
			delete (newEmployee as any)._id;
			return newEmployee;
		} catch (error: any) {
			if (error.code === 11000) {
				throw new AlreadyExistsError(id);
			}
			throw error;
		}
	}

	/**
	 * Retrieves all employees or filters them by department.
	 *
	 * @param department - Optional department name to filter employees by.
	 * @returns {Promise<Employee[]>} An array of employees matching the filter.
	 */
	async getAll(department?: string): Promise<Employee[]> {
		const filter = department ? { department } : {};
		const docs = await this.collection.find(filter, PLUG).toArray();
		return docs;
	}

	/**
	 * Updates an existing employee by ID.
	 *
	 * If the employee does not exist, throws a `NotFoundError`.
	 *
	 * @param id - The employee ID to update.
	 * @param empl - A partial employee object containing updated fields.
	 * @returns {Promise<Employee>} The updated employee.
	 * @throws {NotFoundError} If no employee with the given ID exists.
	 */
	async updateEmployee(
		id: string,
		empl: Partial<Employee>
	): Promise<Employee> {
		const result = await this.collection.findOneAndUpdate(
			{ id },
			{ $set: empl },
			{ returnDocument: "after", ...PLUG }
		);

		if (!result) {
			throw new NotFoundError(id);
		}
		return result;
	}

	/**
	 * Deletes an employee by ID.
	 *
	 * If no employee is found, throws a `NotFoundError`.
	 *
	 * @param id - The employee ID to delete.
	 * @returns {Promise<Employee>} The deleted employee.
	 * @throws {NotFoundError} If the employee does not exist.
	 */
	async deleteEmployee(id: string): Promise<Employee> {
		const doc = await this.collection.findOneAndDelete({ id }, PLUG);

		if (!doc) {
			throw new NotFoundError(id);
		}

		return doc;
	}

	/**
	 * Retrieves an employee by ID.
	 *
	 * @param id - The employee ID to retrieve.
	 * @returns {Promise<Employee>} The employee object.
	 * @throws {NotFoundError} If the employee is not found.
	 */
	async getEmployee(id: string): Promise<Employee> {
		const doc = await this.collection.findOne({ id }, PLUG);
		if (!doc) {
			throw new NotFoundError(id);
		}
		return doc;
	}

	/**
	 * Closes the MongoDB connection.
	 *
	 * Subclasses may extend this method to perform additional cleanup.
	 *
	 * @returns A Promise that resolves when the connection is closed.
	 */
	async save(): Promise<void> {
		await this.client.close();
	}
}

export default AbstractEmployeesServiceMongo;
