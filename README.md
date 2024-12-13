# Project Name: Book Collection API

This project is a **RESTful API** for managing a book collection with authentication and role-based access control (RBAC). It allows users and admins to perform various operations like adding books, viewing favorites, and getting recommendations.

---

## Table of Contents

- [Overview](##overview)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Interacting with the API](#interacting-with-the-api)
- [Testing the API](#testing-the-api)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

## **Overview**

The **Book Collection API** enables users and administrators to manage books and perform actions such as:
- **Adding, updating, and deleting books.**
- **Viewing user-specific books and favorites.**
- **Admin access to manage all books and favorites.**
- **Personalized recommendations based on user activity.**

The API uses **JWT (JSON Web Token)** for secure authentication and includes endpoints restricted to specific roles.

---

## **Features**

- **Authentication**: Signup and login for users and admins.
- **Role-Based Access**: Admin-only and user-only routes.
- **CRUD Operations**: Manage books (Create, Read, Update, Delete).
- **Favorites and Recommendations**: Track favorite books and get recommendations.

---

## **Setup Instructions**

### **Prerequisites**
1. Ensure **Node.js** and **npm** are installed on your machine.
2. Have a running instance of **MongoDB** locally or on a cloud service like MongoDB Atlas.

### **Installation Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/BrukAbebe/stage-three-auth-rbac-book-api.git

2. Install the dependencies:
    ```bash
    npm install

3. **Create a `.env` file** in the root directory and configure the following:

   ```plaintext
   PORT=3000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   BCRYPT_SALT_ROUNDS=your_round
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development

4. Start the server:
    ```bash
     npm start

5. Verify the server is running:

## Interacting with the API

### Base URL

- **Local Environment**: `http://localhost:3000`

### Endpoints

The API is divided into the following categories:

#### Authentication

- **POST** `/auth/signup` - Sign up as a user or admin.
- **POST** `/auth/login` - Log in to receive a JWT token.

#### Books

- **POST** `/books` - Add a new book (user or admin).
- **GET** `/books` - Get books owned by the user.
- **GET** `/books/all` - Admin-only: Get all books.
- **DELETE** `/books/:id` - Delete a book by ID.
- **UPDATE** `/books/:id` - Update a book by ID.
- **GET** `/books/recommendations` - Get book recommendations.

#### Favorites

- **GET** `/books/favorites` - Get the user's favorite books.
- **GET** `/books/favorites/all` - Admin-only: Get all users' favorite books.


## Testing the API

### Postman Collection

- A comprehensive Postman collection is provided for easy testing.
- Download the collection: [API Documentation](docs/API_Documentation.postman_collection.json)

### Steps to Test

1. **Import the Postman collection**:
   - Open Postman.
   - Click **Import** and select the `API_Documentation.postman_collection.json` file.

2. **Use the pre-configured requests** to interact with the API.

3. **Authenticate**:
   - Use `/auth/signup` and `/auth/login` to create an account and log in.
   - Copy the JWT token from the login response and add it to the Authorization header as:
     ```
     Authorization: Bearer <your_token>
     ```

4. **Test role-restricted routes**:
   - Admin-only routes require an admin JWT.
   - User-specific routes require a user JWT.



## Documentation

### Postman Collection

The API documentation is available as a Postman collection:

- Download Postman Collection: [API Documentation](docs/API_Documentation.postman_collection.json)

This collection provides pre-configured requests for:
- Signup
- Login
- CRUD operations on books
- Role-restricted access testing