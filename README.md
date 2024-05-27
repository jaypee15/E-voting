# E-voting Apllication API

## Overview
The E-voting API is a web-based application that allows users to cast their votes in an online voting system. This API is built using Node.js, Express, and MongoDB.

## Installation
To install and run the E-voting API, follow these steps:

1. Clone the repository: 
2. Navigate to the project directory:
3. Install the dependencies:
4. Set up the MongoDB database:
- Install MongoDB on your local machine or use a cloud-based MongoDB service.
- Create a new database and name it "e-voting".
- Create a new user and set up the necessary permissions for the "e-voting" database.
- Update the `.env` file with your MongoDB connection string and user credentials.

5. Start the server:
## Usage
The E-voting API provides the following endpoints:

 ## User Endpoints
### Create User
- **URL**: `/api/users`
- **Method**: `POST`
- **Description**: Register a new user.
- **Request Body**:
  - `username`: Username of the user.
  - `email`: Email address of the user.
  - `password`: Password for the user.
  - `address`: (Optional) Address of the user.
  - `phoneNumber`: (Optional) Phone number of the user.
  - `photo`: (Optional) Profile photo of the user.
  - `role`: (Optional) Role of the user (default: 'buyer').
- **Response**: 
  - `user`: User object containing user details excluding password.
  - `token`: JWT token for authentication.

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user.
- **Request Body**:
  - `email` or `username`: Email address or username of the user.
  - `password`: Password for the user.
- **Response**: 
  - `user`: User object containing user details excluding password.
  - `token`: JWT token for authentication.

### Get User
- **URL**: `/api/users/:userID`
- **Method**: `GET`
- **Description**: Get details of a specific user.
- **Response**: 
  - `user`: User object containing user details excluding password.

### Get All Users
- **URL**: `/api/users`
- **Method**: `GET`
- **Description**: Get details of all users.
- **Response**: 
  - `users`: Array of user objects containing user details excluding password.

### Update User
- **URL**: `/api/users/:userID`
- **Method**: `PATCH`
- **Description**: Update details of a specific user.
- **Request Body**: 
  - Fields to be updated (e.g., `username`, `email`, `address`, `phoneNumber`, `photo`, `role`).
- **Response**: 
  - `user`: Updated user object containing user details.

### Delete User
- **URL**: `/api/users/:userID`
- **Method**: `DELETE`
- **Description**: Delete a specific user.

### Update Password
- **URL**: `/api/users/password`
- **Method**: `POST`
- **Description**: Update the password of a user.
- **Request Body**: 
  - `currentPassword`: Current password of the user.
  - `newPassword`: New password for the user.

### Forgot Password
- **URL**: `/api/users/password`
- **Method**: `POST`
- **Description**: Request a password reset OTP.
- **Request Body**: 
  - `email`: Email address of the user.

### Reset Password
- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Description**: Reset the password using OTP.
- **Request Body**: 
  - `email`: Email address of the user.
  - `otp`: One-time password sent to the user's email.
  - `newPassword`: New password for the user.


## Votes Endpoints

## Endpoints
### Create Voting Room
- **URL**: `/api/votes/voting-rooms`
- **Method**: `POST`
- **Description**: Create a voting room with contestants.
- **Request Body**:
  - `name`: Voting Room Name.
  - `contestants`: Contestants Details, name, image, username.
  - `startDate`: start date and time of voting.
  - `endDate`: end date and time of voting.
  
- **Response**: 
  - `user`: User object containing user details excluding password.
  - `token`: JWT token for authentication.

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user.
- **Request Body**:
  - `email` or `username`: Email address or username of the user.
  - `password`: Password for the user.
- **Response**: 
  - `user`: User object containing user details excluding password.
  - `token`: JWT token for authentication.

### Get User
- **URL**: `/api/users/:userID`
- **Method**: `GET`
- **Description**: Get details of a specific user.
- **Response**: 
  - `user`: User object containing user details excluding password.

### Get All Users
- **URL**: `/api/users`
- **Method**: `GET`
- **Description**: Get details of all users.
- **Response**: 
  - `users`: Array of user objects containing user details excluding password.

### Update User
- **URL**: `/api/users/:userID`
- **Method**: `PATCH`
- **Description**: Update details of a specific user.
- **Request Body**: 
  - Fields to be updated (e.g., `username`, `email`, `address`, `phoneNumber`, `photo`, `role`).
- **Response**: 
  - `user`: Updated user object containing user details.

### Delete User
- **URL**: `/api/users/:userID`
- **Method**: `DELETE`
- **Description**: Delete a specific user.

### Update Password
- **URL**: `/api/users/password`
- **Method**: `POST`
- **Description**: Update the password of a user.
- **Request Body**: 
  - `currentPassword`: Current password of the user.
  - `newPassword`: New password for the user.

### Forgot Password
- **URL**: `/api/users/password`
- **Method**: `POST`
- **Description**: Request a password reset OTP.
- **Request Body**: 
  - `email`: Email address of the user.

### Reset Password
- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Description**: Reset the password using OTP.
- **Request Body**: 
  - `email`: Email address of the user.
  - `otp`: One-time password sent to the user's email.
  - `newPassword`: New password for the user.
