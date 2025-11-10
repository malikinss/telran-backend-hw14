// src/service/bootstrap.ts

import "./employee/sql/EmployeesServiceSqlite.ts";
import "./employee/localFileStorage/EmployeesServiceMap.ts";
import "./employee/localFileStorage/EmployeesServiceMock.test.ts";
import "./employee/mongo/EmployeesServiceMongoInMemory.ts";

import { createEmployeesService } from "./registry.ts";

const key = process.argv[2] || process.env.EMPLOYEES_IMPL;
const service = await createEmployeesService(key);
export default service;
