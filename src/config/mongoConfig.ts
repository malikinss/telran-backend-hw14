// src/config/mongoConfig.ts

import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Default database and collection names for MongoDB-based employee services.
 * These constants are shared across Mongo service implementations to maintain consistency.
 */
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? "employees_db";
export const MONGO_COLLECTION_NAME =
	process.env.MONGO_COLLECTION_NAME ?? "employees";

/**
 * Starts a new in-memory MongoDB server instance using `mongodb-memory-server`.
 *
 * @async
 * @function createInMemoryMongoConfig
 * @returns {Promise<{ uri: string; server: MongoMemoryServer }>}
 * An object containing the connection URI and the running in-memory server instance.
 *
 * @example
 * const { uri, server } = await createInMemoryMongoConfig();
 * console.log(uri); // "mongodb://127.0.0.1:XXXXX/employees_db"
 */
export const createInMemoryMongoConfig = async (): Promise<{
	uri: string;
	server: MongoMemoryServer;
}> => {
	const mongoMemoryServer = await MongoMemoryServer.create();
	const uri = mongoMemoryServer.getUri();
	return { uri, server: mongoMemoryServer };
};
