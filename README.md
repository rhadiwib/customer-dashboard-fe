# Regional Customer Management Dashboard

## Overview
A React-based dashboard application for managers to visualize and track customer data across different regional hierarchies (city, province, and country levels). The application provides interactive visualizations using Google Charts to display customer distribution and regional coverage for different managers.

## Features
- Manager selection dropdown for easy navigation
- Interactive Google Charts visualization showing:
  - Region level hierarchy (City, Province, Country)
  - Number of customers under selected manager
  - Number of unique cities/regions covered
- Real-time data fetching from REST API
- Responsive design with Tailwind CSS
- TypeScript integration for better type safety

## Tech Stack
- React v19.0.0
- Vite v6.1.0
- TypeScript
- Tailwind CSS v4
- Google Charts
- Axios for API calls

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd regional-customer-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
VITE_API_BASE_URL=http://localhost:9191/api
```

4. Start the development server
```bash
npm run dev
```

## Project Structure
```
src/
.
├── App.css
├── App.tsx
├── assets
│   └── react.svg
├── components
│   ├── Dashboard.tsx
│   └── shared
│       ├── ChartSkeleton.tsx
│       └── ErrorBoundary.tsx
├── hooks
│   └── useDataCache.ts
├── index.css
├── main.tsx
├── services
│   └── api.ts
├── types
│   └── region.ts
└── vite-env.d.ts
6 directories, 12 files
```

## Available API Endpoints

### 1. Fetch Manager Details
```http
GET /api/managers/:id/details
```

### 2. List All Managers
```http
GET /api/managers
```

### 3. Fetch Customers by Manager
```http
GET /api/managers/:id/customers
```

### 4. Fetch Manager Region Hierarchy
```http
GET /api/managers/:id/hierarchy
```

### 5. Fetch Customer Statistics
```http
GET /api/managers/:id/stats
```

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Acknowledgments
- Built with Vite and React
- Styled with Tailwind CSS
- Visualizations powered by Google Charts
- TypeScript for type safety