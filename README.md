# Blog Platform Backend

## Overview

The Blog Platform Backend is a secure and scalable API built with TypeScript, Node.js, Express.js, and MongoDB. It supports two roles: Admin and User. Users can perform CRUD operations on their blogs, while Admins manage users and blogs. The API includes authentication, role-based access control, and public access for reading blogs with search, sort, and filter functionalities.

---

## Features

### User Roles

- **Admin:**
  - Manually created in the database.
  - Can delete any blog.
  - Can block users by updating the `isBlocked` property.
  - Cannot update blogs.
- **User:**
  - Can register and log in.
  - Can create, update, and delete their own blogs.
  - Cannot perform Admin actions.

### Authentication & Authorization

- **Authentication:**
  - JWT-based login system for secured operations.
- **Authorization:**
  - Role-based access control differentiating Admins and Users.

### Blog API

- Public API for viewing blogs with details like title, content, author, etc.
- Supports search, sorting, and filtering functionalities.

---

## Models

### User Model

| Field       | Type      | Description                                            |
| ----------- | --------- | ------------------------------------------------------ | ------------------------------ |
| `name`      | `string`  | Full name of the user.                                 |
| `email`     | `string`  | Email address for authentication and communication.    |
| `password`  | `string`  | Securely stored password.                              |
| `role`      | `"admin"  | "user"`                                                | User role, defaults to "user". |
| `isBlocked` | `boolean` | Indicates if the user is blocked, defaults to `false`. |
| `createdAt` | `Date`    | Timestamp when the user was created.                   |
| `updatedAt` | `Date`    | Timestamp of the last update to the user.              |

### Blog Model

| Field         | Type       | Description                                             |
| ------------- | ---------- | ------------------------------------------------------- |
| `title`       | `string`   | Blog title.                                             |
| `content`     | `string`   | Main content of the blog.                               |
| `author`      | `ObjectId` | Reference to the User model.                            |
| `isPublished` | `boolean`  | Indicates if the blog is published, defaults to `true`. |
| `createdAt`   | `Date`     | Timestamp when the blog was created.                    |
| `updatedAt`   | `Date`     | Timestamp of the last update to the blog.               |

---

## API Endpoints

### 1\. Authentication

#### 1.1 Register User

**POST** `/api/auth/register`

**Description:** Registers a new user with the platform. It validates user data and saves it to the database.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**

- **Success (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "statusCode": 201,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
}
```

- **Failure (400):**

```json
{
  "success": false,
  "message": "Validation error",
  "statusCode": 400,
  "error": { "details" },
  "stack": "error stack"
}
```

####

#### 1.2 Login User

**POST** `/api/auth/login`

**Description:** Authenticates a user with their email and password and generates a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**

- **Success (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "statusCode": 200,
  "data": {
    "token": "string"
  }
}
```

- **Failure (401):**

```json
{
  "success": false,
  "message": "Invalid credentials",
  "statusCode": 401,
  "error": { "details" },
  "stack": "error stack"
}
```

###

### 2\. Blog Management

#### 2.1 Create Blog

**POST** `/api/blogs`

**Description:** Allows a logged-in user to create a blog by providing a title and content.

**Request Header:**`Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "My First Blog",
  "content": "This is the content of my blog."
}
```

**Response:**

- **Success (201):**

```json
{
  "success": true,
  "message": "Blog created successfully",
  "statusCode": 201,
  "data": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "author": { "details" }
  }
}
```

####

#### 2.2 Update Blog

**PATCH** `/api/blogs/:id`

**Description:** Allows a logged-in user to update their own blog by its ID.

**Request Header:**`Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "Updated Blog Title",
  "content": "Updated content."
}
```

**Response:**

- **Success (200):**

```json
{
  "success": true,
  "message": "Blog updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "author": { "details" }
  }
}
```

####

#### 2.3 Delete Blog

**DELETE** `/api/blogs/:id`

**Description:** Allows a logged-in user to delete their own blog by its ID.

**Request Header:**`Authorization: Bearer <token>`

**Response:**

- **Success (200):**

```json
{
  "success": true,
  "message": "Blog deleted successfully",
  "statusCode": 200
}
```

####

#### 2.4 Get All Blogs (Public)

**GET** `/api/blogs`

**Description:** Provides a public API to fetch all blogs with options for searching, sorting, and filtering.

**Query Parameters**:

- `search`: Search blogs by title or content (e.g., `search=blogtitle`).
- `sortBy`: Sort blogs by specific fields such as `createdAt` or `title` (e.g., `sortBy=title`).
- `sortOrder`: Defines the sorting order. Accepts values `asc` (ascending) or `desc` (descending). (e.g., `sortOrder=desc`).
- `filter`: Filter blogs by author ID (e.g., `filter=authorId`).

**Example Request URL**:

```sql
/api/blogs?search=technology&sortBy=createdAt&sortOrder=desc&filter=60b8f42f9c2a3c9b7cbd4f18
```

In this example:

- `search=technology`: Filters blogs containing the term "technology" in the title or content.
- `sortBy=createdAt`: Sorts the blogs by the `createdAt` field.
- `sortOrder=desc`: Sorts in descending order (newest blogs first).
- `filter=60b8f42f9c2a3c9b7cbd4f18`: Filters blogs authored by the user with the given `authorId`.

**Response:**

- **Success (200):**

```json
{
  "success": true,
  "message": "Blogs fetched successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "author": { "details" }
    }
  ]
}
```

###

### 3\. Admin Actions

#### 3.1 Block User

**PATCH** `/api/admin/users/:userId/block`

**Description:** Allows an admin to block a user by updating the `isBlocked` property to `true`.

**Request Header:**`Authorization: Bearer <admin_token>`

**Response:**

- **Success (200):**

```json
{
  "success": true,
  "message": "User blocked successfully",
  "statusCode": 200
}
```

####

#### 3.2 Delete Blog

**DELETE** `/api/admin/blogs/:id`

**Description:** Allows an admin to delete any blog by its ID.

**Request Header:**`Authorization: Bearer <admin_token>`

**Response:**

- **Success (200):**

```json
{
  "success": true,
  "message": "Blog deleted successfully",
  "statusCode": 200
}
```

---

## Bonus Section

### 1\. Error Handling

Error handling is crucial in ensuring that an application responds gracefully to unexpected situations, providing users with meaningful feedback while maintaining system stability. A well-structured error response format helps in identifying and diagnosing issues effectively.

#### Common Error Response Format

To maintain consistency across all API endpoints, the following error response structure will be used:

```json
{
  "success": false,
  "message": "Error message describing the issue",
  "statusCode": 400, // or other relevant HTTP status code
  "error": { "details": "Additional error details, if applicable" },
  "stack": "error stack trace, if available"
}
```

#### Types of Errors Handled

The following common errors will be managed with appropriate responses:

- **Zod Validation Error** (`ZOD_ERROR`): Errors arising from invalid data inputs based on Zod schema validation.
- **Not Found Error** (`NOT_FOUND_ERROR`): When requested resources (e.g., a user, item, or page) are not found.
- **Validation Error** (`VALIDATION_ERROR`): General validation errors (e.g., incorrect data format, missing required fields).
- **Authentication Error** (`AUTH_ERROR`): Issues related to failed authentication (e.g., invalid token or expired session).
- **Authorization Error** (`AUTHORIZATION_ERROR`): When the user lacks the necessary permissions to access a resource.
- **Internal Server Error** (`INTERNAL_SERVER_ERROR`): Unhandled errors or unexpected server issues.

By consistently implementing these error handling mechanisms, we ensure a smooth user experience and easier debugging for developers.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine.
- **MongoDB**: A running instance of MongoDB (local or cloud-based).

### Installation

Clone the Repository:

```bash Copy code
git clone "https://github.com/Shabbir878/Blog-Project-Backend.git"
```

### Install Dependencies:

```bash Copy code
npm install
```

### Backend Configuration:

Navigate to the backend folder:

```bash Copy code
cd Blog-Project-Backend
```

### Create .env File:

Create a .env file in the backend directory and add the following environment variables:

```plaintext Copy code
NODE_ENV=development
PORT=your_port
DB_URL=your_db_url
BCRYPT_SALT_ROUNDS=your_bcrypt_salt_rounds
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES_IN=your_jwt_access_expires_in
```

### Start the Backend Server:

```bash Copy code
npm run start:dev
```

## Testing

- **API Testing**: Use Postman or similar tools to test the API endpoints.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
