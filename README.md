# ShopSmart

Welcome to the repository for ShopSmart. This is a full-stack, modern e-commerce platform that I built to replicate a premium online shopping experience. The main goal of this project was to focus heavily on a clean, dynamic user interface while making sure the backend is robust enough to handle products, carts, complex authentication and payments efficiently.

## What's it built with?

The application is split into two main parts—a frontend client and a backend REST API server.

**Frontend:**
- **React 18** (bootstrapped with Vite for super fast builds)
- Built with a focus on modern design, utilizing vanilla CSS for flexible styling and custom micro-animations.
- Uses **Vitest** for running frontend component tests.

**Backend:**
- **Node.js & Express** serving as the core API framework.
- **Sequelize & SQLite (supports Postgres)** for managing relational database models.
- **Passport.js** for handling user authentication, including Google OAuth integration.
- **Stripe API** for handling secure payments and checkouts.
- **Jest** for backend health-checks and endpoint testing.

## Features at a Glimpse

- **Authentication:** Users can sign up natively with an email and password, or use Google OAuth for a frictionless sign-in experience.
- **Product Catalog:** A fully searchable, paginated, and filterable product catalog.
- **Shopping Cart:** Add item components, remove them, or quickly update quantities directly from the cart view.
- **Checkout Flow:** Fully integrated Stripe checkout session to handle live payments and complete orders.
- **Responsive UI:** The frontend looks and feels great on both desktop and mobile devices.

## Getting Started Locally

If you want to spin this up on your own machine to explore the code or contribute, follow these quick steps. You'll need Node.js installed to get started.

### 1. Set up the Backend

First, open up a terminal and navigate into the backend directory:
```bash
cd server
npm install
```

You'll need a `.env` file for the backend to run properly. Make a copy of the `.env.example` file and rename it to `.env`. For local testing, you don't necessarily need all the external API keys, but things like `JWT_SECRET` are required. For full functionality, pop in your Google OAuth and Stripe keys.

Once your environment variables are ready, you can seed the SQLite database with some dummy data and start the server:
```bash
npm run seed
npm run dev
```
The backend server will normally start up on `http://localhost:5001`.

### 2. Set up the Frontend

Open up a second terminal tab and navigate into the `client` directory:
```bash
cd client
npm install
npm run dev
```
The frontend should quickly spin up on `http://localhost:5173`. The Vite configuration is already proxying outgoing API requests to port `5001`, so you won't need to fiddle with any CORS or separate base URLs manually in development mode.

## Testing & Automation 

A reliable pipeline is important, so this repository utilizes a GitHub Actions CI/CD pipeline. Every time code is pushed or a pull request is raised to `main`, the pipeline will automatically check for any linting errors using ESLint and execute both the client-side (Vitest) and server-side (Jest) test suites to make sure nothing gets broken by accident. 
