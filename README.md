# ShopSmart - Premium E-commerce Platform

ShopSmart is a modern, full-stack e-commerce application designed with a focus on visual excellence and performance. Inspired by premium shopping experiences, it features an elegant user interface, dynamic data management, and a robust backend.

## ✨ Key Features

- **Premium UI/UX**: Amazon-inspired design with modern typography, smooth transitions, and glassmorphism elements.
- **Dynamic Data Ingestion**: Automatically extracts and seeds thousands of products from an `archive.zip` file upon startup.
- **Advanced Search & Filtering**: Fast, server-side search and category-based filtering for an efficient shopping experience.
- **Secure Authentication**: User registration and login with JWT-based sessions.
- **Persistent Cart & Checkout**: Seamless shopping cart experience with order tracking.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🚀 Tech Stack

- **Frontend**: React, Vite, CSS3 (Vanilla for premium design control).
- **Backend**: Node.js, Express.
- **Database**: SQLite3 with Sequelize ORM.
- **Data Processing**: `csv-parse` for large-scale data ingestion.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or later)
- `unzip` utility (available on most Unix/Mac systems)

### Backend Setup
1. Navigate to the server directory: `cd shopsmart/server`
2. Install dependencies: `npm install`
3. Seed the database (automatically unzips `archive.zip`): `npm run seed`
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the client directory: `cd shopsmart/client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## 📖 Deployment

- **Backend**: Configured for deployment on Render (see `render.yaml`).
- **Frontend**: Ready for Vercel or Netlify.
