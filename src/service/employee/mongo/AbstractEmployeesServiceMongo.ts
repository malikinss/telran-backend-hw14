// src/service/employee/mongo/AbstractEmployeesServiceMongo.ts

import { Collection, Db, MongoClient } from "mongodb";
import { Employee } from "../../../model/dtoTypes/Employee.ts";
import EmployeesService from "../EmployeesService.ts";
import { NotFoundError } from "../../../model/errorTypes/employeeErrors.ts";

abstract class AbstractEmployeesServiceMongo implements EmployeesService {
	client: MongoClient;
	db: Db;
	collection: Collection<Employee>;

	constructor(
		uri: string,
		private dbName: string,
		private collectionName: string
	) {
		this.client = new MongoClient(uri);
	}

	async init(): Promise<void> {
		await this.client.connect();
		this.db = this.client.db(this.dbName);
		this.collection = this.db.collection(this.collectionName);
		this.collection.createIndex({ id: 1 }, { unique: true });
		this.collection.createIndex({ department: "hashed" });
	}

	async addEmployee(empl: Employee): Promise<Employee> {
		throw new Error("Method not implemented.");
	}
	async getAll(department?: string): Promise<Employee[]> {
		const filter = department ? { department } : {};
		return await this.collection.find(filter).toArray();
	}

	async updateEmployee(
		id: string,
		empl: Partial<Employee>
	): Promise<Employee> {
		throw new Error("Method not implemented.");
	}

	async deleteEmployee(id: string): Promise<Employee> {
		throw new Error("Method not implemented.");
	}

	async getEmployee(id: string): Promise<Employee> {
		const empl = await this.collection.findOne({ id });
		if (!empl) {
			throw new NotFoundError(id);
		}
		return empl;
	}

	async save(): Promise<void> {
		await this.client.close();
	}
}

export default AbstractEmployeesServiceMongo;
