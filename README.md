# Store Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.3-06B6D4?style=for-the-badge&logo=tailwindcss)

E-Commerce frontend built with React, TypeScript, and Vite, designed to showcase a modern storefront experience with product browsing, cart management, checkout flow, and admin-style dashboard interactions.

## Project Overview

This project is a storefront application that simulates a real online retail experience. It focuses on clean UI design, responsive layout, product discovery, and user interaction flows such as registration, authentication, and order placement.

The app is structured as a client-side commerce interface intended to connect to a backend API for inventory, orders, and user operations. A matching backend solution is [Store-API](https://www.github.com/Danix43/Store-API), and it is a plug and play for making a running application.

Mock data for products and order are preloaded in the application. Some functions, namely the user authentication, may not work without a auth API.

## Key Features

- Responsive storefront with category-based product filtering
- Product cards with pricing and add-to-cart interactions
- Dynamic cart with quantity management and subtotal logic
- Checkout experience with card payment form and validation
- Login and registration pages for user access
- Dashboard for product management and order monitoring
- API integration using Axios and React Query (TanStack)
- Dark, premium storefront styling for a modern brand feel

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- TanStack React Query
- Axios
- Oxlint

## Screens and User Flows

### Storefront

The homepage presents a curated product catalog with category filters and a premium visual layout.

### Cart & Checkout

Users can add products to their cart, adjust quantities, review totals, and complete checkout with form validation.

### Authentication

The app includes dedicated login and registration views to support account-based shopping experiences.

### Dashboard

An admin-style dashboard is included for product editing and reviewing order data.

## Getting Started

### Prerequisites

- Node.js 18 or later or equivalent
- npm

### Installation

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local app in your browser:

```text
http://localhost:5173
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Available Scripts

```bash
npm run dev      # start the Vite development server
npm run build    # compile TypeScript and build the app
npm run lint     # lint the project with Oxlint
npm run preview  # preview the production build locally
```

## API Integration

The frontend is configured to communicate with a backend API running locally at:

```text
http://localhost:8080/api
```

It currently includes calls for:

- product retrieval
- order creation
- order retrieval
- login
- registration

## License

This project is covered under the MIT License.
