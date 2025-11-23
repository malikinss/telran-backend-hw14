// src/service/employee/mongo/EmployeesServiceMongoInMemory.ts

import { MongoMemoryServer } from "mongodb-memory-server";
import AbstractEmployeesServiceMongo from "./AbstractEmployeesServiceMongo.ts";
import { registerEmployeesService } from "../../registry.ts";
import {
	MONGO_DB_NAME,
	MONGO_COLLECTION_NAME,
	createInMemoryMongoConfig,
} from "../../../config/mongoConfig.ts";

/**
 * In-memory MongoDB implementation of the Employees service.
 *
 * This service is designed for testing or local development purposes.
 * It uses `mongodb-memory-server` to create a temporary, in-memory
 * MongoDB instance that behaves like a real database, but without
 * requiring a running MongoDB server.
 *
 * The database is automatically started during service initialization
 * and stopped once data is persisted using the `save()` method.
 */
class EmployeesServiceMongoInMemory extends AbstractEmployeesServiceMongo {
	private readonly mongoMemoryServer: MongoMemoryServer;

	/**
	 * Creates a new in-memory MongoDB Employees service.
	 *
	 * @param uri - The connection URI for the in-memory MongoDB instance.
	 * @param dbName - The name of the in-memory database.
	 * @param collectionName - The name of the collection where employees are stored.
	 * @param mongoMemoryServer - The `MongoMemoryServer` instance managing the temporary database.
	 */
	constructor(
		uri: string,
		dbName: string,
		collectionName: string,
		mongoMemoryServer: MongoMemoryServer
	) {
		super(uri, dbName, collectionName);
		this.mongoMemoryServer = mongoMemoryServer;
	}

	/**
	 * Flushes and closes the in-memory database instance.
	 *
	 * Ensures that:
	 * - All pending write operations are completed.
	 * - Both Mongo client and in-memory server are gracefully stopped.
	 *
	 * @returns A Promise that resolves once the shutdown is complete.
	 */
	async save(): Promise<void> {
		try {
			await super.save();
		} finally {
			// Ensures the memory server always stops, even if closing the client fails.
			await this.mongoMemoryServer.stop();
		}
	}
}

/**
 * Registers the `mongoInMemory` employees service in the service registry.
 *
 * @async
 * @function mongoInMemoryFactory
 * @returns {Promise<EmployeesServiceMongoInMemory>} The initialized service instance.
 */
const mongoInMemoryFactory =
	async (): Promise<EmployeesServiceMongoInMemory> => {
		const { uri, server } = await createInMemoryMongoConfig();
		const service = new EmployeesServiceMongoInMemory(
			uri,
			MONGO_DB_NAME,
			MONGO_COLLECTION_NAME,
			server
		);
		await service.init();
		return service;
	};

registerEmployeesService("mongoInMemory", mongoInMemoryFactory);

export default EmployeesServiceMongoInMemory;
