# DayFlow Backend API Testing Guide

## Quick Start

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Test the Backend**
   - Use Postman, Insomnia, or curl to test the endpoints below

## Authentication Endpoints

### 1. User Signup
**POST** `http://localhost:4000/api/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "employee@dayflow.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "employee"
}
```

**Expected Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "employeeId": null,
  "email": "employee@dayflow.com",
  "role": "employee",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. User Login
**POST** `http://localhost:4000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "employee@dayflow.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "employeeId": null,
  "email": "employee@dayflow.com",
  "role": "employee",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get Current User Profile
**GET** `http://localhost:4000/api/auth/me`

**Headers:**
```
Authorization: Bearer <token_from_signup_or_login>
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "employee@dayflow.com",
  "role": "employee",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "",
  "address": "",
  "department": "",
  "position": "",
  "joiningDate": "2026-01-03T00:00:00.000Z",
  "profilePicture": "",
  "isEmailVerified": false,
  "isActive": true,
  "createdAt": "2026-01-03T10:00:00.000Z",
  "updatedAt": "2026-01-03T10:00:00.000Z"
}
```

---

## User Management Endpoints

### 4. Get All Users (Admin/HR only)
**GET** `http://localhost:4000/api/users`

**Headers:**
```
Authorization: Bearer <admin_or_hr_token>
```

**Expected Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "employee@dayflow.com",
    "role": "employee",
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
]
```

---

### 5. Get User Profile
**GET** `http://localhost:4000/api/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id`: User ID (e.g., 507f1f77bcf86cd799439011)

---

### 6. Update User Profile
**PUT** `http://localhost:4000/api/users/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (Employee can only update certain fields):**
```json
{
  "phone": "+1-234-567-8900",
  "address": "123 Main St, City, State",
  "profilePicture": "https://example.com/profile.jpg"
}
```

**Admin/HR can also update:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1-234-567-8900",
  "address": "123 Main St, City, State",
  "department": "Engineering",
  "position": "Senior Developer",
  "profilePicture": "https://example.com/profile.jpg",
  "isActive": true
}
```

---

### 7. Delete User (Admin only)
**DELETE** `http://localhost:4000/api/users/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## Attendance Endpoints

### 8. Check In
**POST** `http://localhost:4000/api/attendance/checkin`

**Headers:**
```
Authorization: Bearer <token>
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "date": "2026-01-03T00:00:00.000Z",
  "checkIn": "2026-01-03T09:00:00.000Z",
  "checkOut": null,
  "status": "present",
  "workHours": 0,
  "remarks": ""
}
```

---

### 9. Check Out
**POST** `http://localhost:4000/api/attendance/checkout`

**Headers:**
```
Authorization: Bearer <token>
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "date": "2026-01-03T00:00:00.000Z",
  "checkIn": "2026-01-03T09:00:00.000Z",
  "checkOut": "2026-01-03T17:30:00.000Z",
  "status": "present",
  "workHours": 8.5,
  "remarks": ""
}
```

---

### 10. Get Attendance Records
**GET** `http://localhost:4000/api/attendance?startDate=2026-01-01&endDate=2026-01-31`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format
- `userId` (optional): For Admin/HR to filter specific user

---

### 11. Get Attendance Summary
**GET** `http://localhost:4000/api/attendance/summary`

**Headers:**
```
Authorization: Bearer <token>
```

**Expected Response (200):**
```json
{
  "present": 20,
  "absent": 2,
  "half-day": 1,
  "leave": 1
}
```

---

### 12. Update Attendance (Admin/HR only)
**PUT** `http://localhost:4000/api/attendance/:id`

**Headers:**
```
Authorization: Bearer <admin_or_hr_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "present",
  "remarks": "Late arrival due to traffic"
}
```

---

## Leave Endpoints

### 13. Apply for Leave
**POST** `http://localhost:4000/api/leaves`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "leaveType": "paid",
  "startDate": "2026-01-10",
  "endDate": "2026-01-12",
  "reason": "Family vacation"
}
```

**Expected Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "employeeId": null
  },
  "leaveType": "paid",
  "startDate": "2026-01-10",
  "endDate": "2026-01-12",
  "reason": "Family vacation",
  "status": "pending",
  "adminComments": "",
  "reviewedBy": null,
  "reviewedAt": null
}
```

---

### 14. Get Leave Requests
**GET** `http://localhost:4000/api/leaves?status=pending`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): pending, approved, rejected
- `userId` (optional): For Admin/HR to filter specific user

---

### 15. Get Single Leave Request
**GET** `http://localhost:4000/api/leaves/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 16. Update Leave Status (Admin/HR only)
**PUT** `http://localhost:4000/api/leaves/:id`

**Headers:**
```
Authorization: Bearer <admin_or_hr_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "approved",
  "adminComments": "Approved. Ensure handover is complete."
}
```

---

### 17. Delete Leave Request
**DELETE** `http://localhost:4000/api/leaves/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## Payroll Endpoints

### 18. Get Payroll Information
**GET** `http://localhost:4000/api/payroll`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `userId` (optional): For Admin/HR to filter specific user

**Expected Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "employeeId": null,
      "email": "employee@dayflow.com"
    },
    "basicSalary": 50000,
    "allowances": {
      "housing": 5000,
      "transport": 1000,
      "medical": 500,
      "other": 0
    },
    "deductions": {
      "tax": 5000,
      "insurance": 500,
      "other": 0
    },
    "netSalary": 50500,
    "currency": "USD",
    "paymentFrequency": "monthly"
  }
]
```

---

### 19. Get Single Payroll
**GET** `http://localhost:4000/api/payroll/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 20. Get Payroll by User ID
**GET** `http://localhost:4000/api/payroll/user/:userId`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 21. Update Payroll (Admin/HR only)
**PUT** `http://localhost:4000/api/payroll/:id`

**Headers:**
```
Authorization: Bearer <admin_or_hr_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "basicSalary": 55000,
  "allowances": {
    "housing": 6000,
    "transport": 1200,
    "medical": 500,
    "other": 0
  },
  "deductions": {
    "tax": 5500,
    "insurance": 600,
    "other": 0
  },
  "currency": "USD",
  "paymentFrequency": "monthly"
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Additional error details (if applicable)"
}
```

### Common Status Codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (no token or invalid token)
- **403**: Forbidden (no permission)
- **404**: Not Found
- **500**: Server Error

---

## Troubleshooting

### Error: "Not authorized, no token"
- Add Authorization header with valid JWT token
- Format: `Authorization: Bearer <token>`

### Error: "User role is not authorized"
- The endpoint requires admin or hr role
- Login with admin/hr account

### Error: "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check MONGO_URI in .env file

### Error: "JWT expired"
- Get a new token by logging in again

---

## Postman Collection Import

You can import all these endpoints into Postman using the following environment variables:

```json
{
  "variables": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000"
    },
    {
      "key": "token",
      "value": "your_jwt_token_here"
    },
    {
      "key": "userId",
      "value": "507f1f77bcf86cd799439011"
    }
  ]
}
```

Then use `{{baseUrl}}` and `{{token}}` in your requests!
