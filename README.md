# Secure Node.js Application with Hapi.js

## Overview

This document provides an overview of the assignment focusing on building a robust Node.js application using Hapi.js, implementing JWT for authentication, managing a PostgreSQL database with Sequelize.js, setting up a CI/CD pipeline with GitHub Actions, and ensuring code quality and security through testing and tools like Snyk.

## Project Purpose

The purpose of this project is to create secure and scalable node app using hapi.js where user can authenticated and store Personal Identification Information (PII) securely.

## Deployed Project

The project is deployed and can be accessed at: [http://13.51.170.78/documentation](http://13.51.170.78/documentation). Users can interact with the API directly from the Swagger documentation interface.

## Architecture

The application follows a modular architecture, separating concerns into distinct layers:

1. **API Layer**: Built using Hapi.js, handling HTTP requests and responses.
2. **Authentication Layer**: Implements JWT for secure user authentication.
3. **Database Layer**: Utilizes PostgreSQL as the primary database, with Sequelize.js as the ORM for database interactions.
4. **Testing Layer**: Employs Jest for unit and integration testing, ensuring code reliability.
5. **CI/CD Layer**: Uses GitHub Actions for automated testing and deployment, improving development workflow and reducing manual errors.
6. **Security Layer**: Integrates Snyk to monitor and fix vulnerabilities in dependencies.

## Technologies Used

- **Hapi.js**: A powerful and flexible framework for building web applications in Node.js.
- **JWT (JSON Web Token)**: Used for secure authentication and authorization.
- **Bcrypt**: Used for hashing and verify the password.
- **PostgreSQL**: An advanced, open-source relational database for data management.
- **Sequelize.js**: A promise-based Node.js ORM for PostgreSQL.
- **Jest**: A delightful JavaScript testing framework for writing unit and integration tests.
- **GitHub Actions**: For CI/CD automation to build, test, and deploy the application.
- **Rate Limiting**: To control the rate of requests to the API.
- **Snyk**: A security tool to find and fix vulnerabilities in dependencies.
- **Istio**: A service mesh for managing microservices traffic (explored but not fully integrated).
- **Swagger**: Used for API documentation, allowing users to explore and interact with the API endpoints.

## Implementation Details

### 1. Hapi.js Setup

- Built a RESTful API using Hapi.js to handle user authentication, data retrieval, and other application functionalities.
- Implemented routes for user login, signup, and data management.

### 2. JWT for Authentication

- Integrated JWT for user authentication, allowing users to securely log in and access protected routes.
- Used JWT to generate tokens upon successful login, which are sent back to the client for subsequent requests.
- Used JWT to validate token if it expired user should logged in again

### 3. Bcrypt

- Used for hashing the password. we are using salt 10 for hashing
- Varifing the incoming password to hashed password

### 4. PostgreSQL with Sequelize.js

- Set up a PostgreSQL database to store user data and application state.
- Utilized Sequelize.js as an ORM to interact with the database, defining models and associations.

### 5. Testing with Jest

- Created unit and integration tests using Jest to ensure code reliability and functionality.
- Employed mocks and spies to isolate tests and verify interactions.

### 6. CI/CD Pipeline with GitHub Actions

- Configured GitHub Actions to automate the build, test, and deployment process.
- Set up workflows to run tests on code push and pull request events.

### 7. Rate Limiting

- Implemented rate limiting on API endpoints to prevent abuse and ensure fair usage of resources.
- Used middleware to enforce limits on the number of requests a user can make in a given time frame.
- Rate limiting added diffrently for user who already logged in and anonymous users

### 8. Security with Snyk

- Integrated Snyk to scan for vulnerabilities in the application’s dependencies.
- Set up alerts for identified vulnerabilities and provided recommendations for remediation.

### 9. Exploring Istio

- Investigated Istio as a service mesh for advanced traffic management, security, and observability.
- Although Istio was explored, it was not fully integrated into the application stack.

### 10. Swagger for API Documentation

- Integrated Swagger for API documentation, providing a user-friendly interface to explore and test the API endpoints.
- Users can play with the APIs directly from the documentation interface.

## Conclusion

This assignment encompassed the development of a backend application utilizing various modern technologies. It demonstrated the ability to create secure APIs, manage databases efficiently, and automate workflows for continuous integration and deployment. Additionally, exploring Istio opened avenues for advanced microservices management, paving the way for future enhancements.

## Future Work

- Further integration of Istio to leverage its full potential for traffic management and service observability.
- Enhancements in testing coverage and performance optimization.
- Continuous monitoring and updating of dependencies to maintain security standards.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/avishmonga/secure-mern-api-hapi.git
   cd secure-mern-api-hapi
   ```
2. npm install

3. Set up environment variables:
   JWT_SECRET=your_jwt_secret
   ENCRYPTION_PASSWORD=your_encryption_password
   HOST=your_host
   REDIS_HOST=your_redis_host
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name

4.npm start

## Usage

1. **Start the server**:
   After running the application, you can access the API at `http://localhost:3000`.

2. **Authentication**:

   - **Signup**: Send a POST request to `/signup` with the following JSON body:
     ```json
     {
       "name": "your name",
       "email": "your email",
       "password": "your_password"
     }
     ```
   - **Login**: Send a POST request to `/login` with the following JSON body:
     ```json
     {
       "email": "your email",
       "password": "your_password"
     }
     ```
   - A successful login will return a JWT token that you can use to access protected routes.

3. **Data Management**:
   Use the provided API endpoints to manage user data. Example requests:

   - **Get all users**: Send a GET request to `/users` with the admin JWT token in the `Authorization` header.

   - **Create pii**: Send a POST request to `/pii` along with jwt token in `Authorization` header with the following JSON body:
     ```json
     {
       "type": "aadhar | pan | driving_licence | passport",
       "value": "value in string"
     }
     ```
   - **Get all pii**: Send a GET request to `/pii` with the JWT token in the `Authorization` header.

   - **Get all pii of user**: Send a GET request to `/pii/:userId` with the admin JWT token in the `Authorization` header.

4. **Rate Limiting**:
   Keep in mind that API endpoints have rate limiting in place to prevent abuse. Exceeding the limit will result in a 429 Too Many Requests error.

## API Endpoints

| Method | Endpoint     | Description                           |
| ------ | ------------ | ------------------------------------- |
| POST   | /signup      | Create a new user                     |
| POST   | /login       | Authenticate a user                   |
| GET    | /users       | Retrieve all users admin only         |
| POST   | /pii         | create pii entry (logged in)          |
| GET    | /pii         | retrive all pii's (logged in)         |
| Get    | /pii/:userId | retrive all pii's of user(admin only) |

## Testing

Run the following command to execute tests:

```bash
npm test
```
