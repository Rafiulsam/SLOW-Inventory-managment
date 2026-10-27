# SLOW Inventory Management

SLOW Inventory Management is a full-stack inventory dashboard for tracking products, stock levels, prices, and low-stock alerts. It provides a simple interface for maintaining a product catalog backed by MongoDB.

## Links

- [Source code on GitHub](https://github.com/Rafiulsam/SLOW-Inventory-managment)
- **Live demo:** Not deployed yet

## Features

- View inventory metrics at a glance:
  - Total products
  - Items currently in stock
  - Out-of-stock products
  - Low-stock products
  - Total purchase value
- Add new products with unit, stock, pricing, and low-stock-limit details.
- View individual product details.
- Update product information directly from the inventory screen.
- Delete products from the catalog.
- Search products by name.
- Filter products by all, in-stock, low-stock, or out-of-stock status.
- Sort products by name, stock, purchase price, or selling price.
- Responsive React interface with loading, error, and connection states.

## Tech Stack

### Client

- React 19
- React Router
- Vite
- Tailwind CSS
- SweetAlert2
- React Icons

### Server

- Node.js
- Express 5
- MongoDB with Mongoose
- CORS
- dotenv

## Project Structure

```text
.
├── client/                 # React/Vite frontend
│   └── src/
│       ├── components/     # Navbar and product row components
│       ├── constants/      # Shared product field definitions
│       └── pages/          # Dashboard, add, details, and update screens
└── server/                 # Express/MongoDB API
		├── controllers/        # Product request handlers
		├── models/             # Mongoose models
		└── routes/             # Product API routes
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database, local or hosted

### 1. Install dependencies

From the project root:

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure the server

Create `server/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/slow-inventory
PORT=5000
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### 3. Configure the client (optional)

The client defaults to `http://localhost:5000`. To use another API URL, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the application

Open two terminals from the project root.

Terminal 1, start the API:

```bash
cd server
npm start
```

Terminal 2, start the frontend:

```bash
cd client
npm run dev
```

Open the local URL shown by Vite, normally [http://localhost:5173](http://localhost:5173).

## API Endpoints

The API runs at `http://localhost:5000` by default.

| Method   | Endpoint        | Description                      |
| -------- | --------------- | -------------------------------- |
| `GET`    | `/`             | Check that the server is running |
| `GET`    | `/products`     | Get all products                 |
| `GET`    | `/products/:id` | Get one product                  |
| `POST`   | `/products`     | Create a product                 |
| `PUT`    | `/products/:id` | Update a product                 |
| `DELETE` | `/products/:id` | Delete a product                 |

## Available Scripts

### Client

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

### Server

```bash
npm start        # Start the Express server with nodemon
```

## Deployment

Deploy the client and server separately, then set `VITE_API_URL` in the client deployment to the public server URL. Configure `MONGODB_URI` and `PORT` in the server deployment environment. After deployment, replace the **Live demo** entry above with the public client URL.
