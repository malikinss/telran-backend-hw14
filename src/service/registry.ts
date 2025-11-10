// src/service/registry.ts

import EmployeeService from "./employee/EmployeesService.ts";

type Factory = (deps: any) => Promise<EmployeeService>;

const registry = new Map<string, Factory>();

/**
 * Registers a new employee service factory with a unique key.
 * @param key Unique identifier for the employee service
 * @param factory Factory function to create the employee service
 * @throws Error if the key is already registered
 */
export function registerEmployeesService(key: string, factory: Factory): void {
	if (registry.has(key)) {
		throw new Error(`Factory with key ${key} is already registered.`);
	}
	registry.set(key, factory);
}

/**
 * Creates an instance of the employee service using the registered factory.
 * @param key Unique identifier for the employee service
 * @param deps Dependencies to be passed to the factory function
 * @returns Promise resolving to the created employee service instance
 * @throws Error if no factory is registered with the given key
 */
export function createEmployeesService(
	key: string,
	deps: any = {}
): Promise<EmployeeService> {
	if (!registry.has(key)) {
		const availableKeys = listEmployeesService().join(", ");
		throw new Error(
			`No factory registered with key ${key}. Available keys: ${availableKeys}`
		);
	}
	return registry.get(key)!(deps);
}

/**
 * Lists all registered employee service keys.
 * @returns List of registered employee service keys
 */
export function listEmployeesService(): string[] {
	return Array.from(registry.keys());
}
