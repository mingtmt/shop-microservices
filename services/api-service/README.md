# Shop Service

A lightweight RESTful API built with Node.js, Express, and MongoDB to manage e-commerce operations like products, categories, and orders.

## Features

- CRUD Operations: Manage products and inventory.
- Database Integration: Scalable data storage with MongoDB and Mongoose.
- Environment Configuration: Secure handling of credentials and API keys.
- Error Handling: Centralized middleware for consistent API responses.

## Tech stack

- Runtime: [NodeJS](https://nodejs.org/)
- Framework: [Express](https://expressjs.com/)
- Database: [MongoDB](https://www.mongodb.com/)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v22)
- MongoDB (Local instance or Atlas URI)
- npm (v10)

## Installation and Setup

1. Clone the repository:

```bash
git clone https://github.com/mingtmt/shop-service.git
cd shop-service
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables: Create a `.env` file in the root directory.

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shop-db
JWT_SECRET=your_super_secret_key
```

4. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```
