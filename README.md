# Homework 14: Mongo Service Implementation with `AbstractEmployeesServiceMongo`

## 🧩 Task Definition

This homework assignment focuses on implementing the `AbstractEmployeesServiceMongo` class and completing all previously unimplemented methods.
Your goal is to provide a fully working Mongo-based service layer, ensure correct handling of CRUD operations, and pass all automated service tests.

To verify completion, run:

```bash
npm run test-service mongoInMemory
```

All tests **must pass**.

---

## 📝 Description

This project implements a flexible, modular Employee Management backend in TypeScript.
It supports multiple storage engines (mock, SQLite, Mongo-in-memory), advanced validation via Zod, structured error handling, and JWT authentication.

Homework #14 specifically deals with the MongoDB layer: implementing the abstract service class and ensuring compatibility with the in-memory MongoDB used in automated tests.

---

## 🎯 Purpose

The main purpose of HW14 is to:

-   Provide a complete implementation of the `AbstractEmployeesServiceMongo` class.
-   Understand and properly implement MongoDB-style CRUD operations using a `Collection` interface.
-   Ensure that the service behaves consistently across different storage backends.
-   Successfully run and pass all service tests using `EmployeesServiceMongoInMemory`.

More generally, this assignment reinforces:

-   Abstraction principles
-   Error handling
-   Data persistence logic
-   Writing backend code ready for testing

---

## ✨ Features

-   Fully implemented MongoDB-style service for employees
-   Pluggable architecture: swap storage engines with a single config change
-   Zod-based input validation
-   JWT authentication & role-based access
-   Clean and consistent error types
-   Express-based REST API
-   Comprehensive test suite (service + route tests)
-   In-memory MongoDB powered by `mongodb-memory-server`

---

## 🏗️ Architecture Overview

The architecture follows a clean-layered structure:

```
Request → Routes → Middleware → Controller → Service → Storage Backend → Response
```

### Key Components

-   **Routes** — define API endpoints (`/employees`, `/login`)
-   **Middleware** — authentication, validation, error handling
-   **Controllers** — contain request/response logic
-   **Services** — implement business logic (Mongo/SQL/mock)
-   **Models** — DTOs and custom errors
-   **Utils** — config, security, file storage, logging
-   **Tests** — service-level & API-level

### Storage Backends Supported

-   **Mongo In-Memory** (for HW14)
-   **SQLite**
-   **Mock in-memory array**
-   **File-based storage**

The system uses a **bootstrap registry** to load the correct storage engine at runtime.

---

## 🔍 How It Works

### HW14 Focus: `AbstractEmployeesServiceMongo`

You implement all CRUD methods using the Mongo-style `Collection` interface:

-   `getAll()`
-   `getEmployee(id)`
-   `addEmployee(employee)`
-   `updateEmployee(id, partialUpdate)`
-   `deleteEmployee(id)`
-   `save()`

Each method must:

-   Throw `NotFoundError` when appropriate
-   Throw `AlreadyExistsError` if adding a duplicate
-   Generate an ID when needed
-   Return clean Employee objects

### Mongo-in-Memory Behavior

The `EmployeesServiceMongoInMemory` class simulates a real MongoDB collection but keeps data in RAM. Tests rely on this deterministic behavior.

### Test Execution Flow

1. Test environment sets `EMPLOYEES_IMPL=mongoInMemory`
2. In-memory DB is initialized
3. Test data is seeded
4. CRUD tests run against your implementation
5. Errors & responses are validated

When all Mongo service methods are implemented correctly → **all tests pass**.

---

## 📜 Output Example

Example response from `GET /employees`:

```json
[
	{
		"id": "emp123",
		"fullName": "Alice Johnson",
		"avatar": "https://example.com/avatar.jpg",
		"department": "QA",
		"birthDate": "1995-05-20",
		"salary": 12000
	}
]
```

---

## 📦 Usage

Start the server:

```bash
npm run dev
```

or manually:

```bash
node --loader ts-node/esm src/index.ts
```

Switch storage implementation via environment variable:

```env
EMPLOYEES_IMPL=mongoInMemory
```

Example with SQLite:

```env
EMPLOYEES_IMPL=sqlite
SQLITE_FILE_NAME=employees.sqlite
```

---

## 🚀 Usage Examples (HTTP)

### Create Employee (ADMIN only)

```http
POST /employees
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "avatar": "https://example.com/img.jpg",
  "department": "IT",
  "birthDate": "1990-01-10",
  "salary": 15000
}
```

### Update Employee

```http
PATCH /employees/emp123
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "salary": 18000
}
```

### Delete Employee

```http
DELETE /employees/emp123
Authorization: Bearer <admin-token>
```

---

## ✅ Dependencies

Key dependencies include:

-   **TypeScript**
-   **Express**
-   **Zod**
-   **jsonwebtoken**
-   **mongodb-memory-server**
-   **Knex + SQLite3**
-   **supertest**
-   **ts-node**
-   **dotenv**

Dev tools:

-   ESLint
-   Nodemon
-   Node test runner

---

## 📊 Project Status

✔️ Fully functional employee backend
✔️ Mongo In-Memory service implemented
✔️ HW14 completed
✔️ All service tests pass
✔️ Ready for extension and deployment

---

## 📄 License

MIT License

---

## 🧮 Conclusion

This homework solidifies your understanding of abstract service layers, MongoDB-like operations, and test-driven backend development.
By completing the `AbstractEmployeesServiceMongo` class and ensuring the service tests pass, you’ve built a clean and reliable persistence layer within a flexible, modular architecture.

Great work — your backend is now production-grade and test-proven. 🚀

---

Made with ❤️ and `TypeScript` by **Sam-Shepsl Malikin** 🎓
