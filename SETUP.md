# Setup Guide - Incident Management Dashboard

## 📋 Prerequisites

- Node.js 18+ and npm/yarn installed
- Git (optional)

## 🚀 Quick Start

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Mock Server Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Start the Mock Server (Terminal 1)

```bash
cd server
npm start
```

The mock server will start on:

- REST API: http://localhost:4000/api
- WebSocket: ws://localhost:4000

### 4. Start the Frontend Dev Server (Terminal 2)

```bash
npm run dev
```

The dashboard will be available at: http://localhost:3000

## 📁 Project Structure

```
.
├── src/
│   ├── app/                    # Redux store & root component
│   │   ├── App.tsx            # Main app component
│   │   ├── store.ts           # Redux store configuration
│   │   ├── rootReducer.ts     # Combined reducers
│   │   └── hooks.ts           # Typed Redux hooks
│   │
│   ├── features/              # Feature modules
│   │   └── incidents/         # Incidents feature
│   │       ├── components/    # React components
│   │       ├── store/         # Redux slice, thunks, selectors
│   │       ├── services/      # API & WebSocket services
│   │       ├── hooks/         # Custom hooks
│   │       └── types/         # TypeScript types
│   │
│   ├── core/                  # Shared infrastructure
│   │   ├── http/              # HTTP client
│   │   └── ws/                # WebSocket client
│   │
│   ├── locales/               # i18n translations
│   │   ├── en.json
│   │   ├── fr.json
│   │   └── i18n.ts
│   │
│   ├── styles/                # Global styles
│   │   └── globals.css
│   │
│   └── index.tsx              # Entry point
│
├── server/                    # Mock backend server
│   ├── mock-server.js        # WebSocket + REST API
│   └── package.json
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 Key Features

### Real-time Updates

- WebSocket connection for live incident updates
- Automatic reconnection with exponential backoff
- Connection status indicator

### State Management

- Redux Toolkit for predictable state management
- Memoized selectors for performance
- Async thunks for API operations

### UI Features

- Responsive design with Tailwind CSS
- Virtualized lists for performance (react-window)
- Advanced filtering (severity, status, service, search)
- Real-time statistics dashboard
- i18n support (English & French)
- Full keyboard navigation and ARIA support

## 🧪 Testing the Dashboard

Once both servers are running:

1. **View Initial Data**: The dashboard will load ~15 mock incidents
2. **Real-time Updates**: New incidents are created every 10 seconds
3. **Filter Incidents**: Use the filter panel to narrow down results
4. **Search**: Type in the search box to find specific incidents
5. **Change Language**: Click the language toggle button (EN/FR)
6. **Connection Status**: Check the connection indicator in the stats summary

## 🔧 Configuration

### Environment Variables

Edit `.env` file to configure API endpoints:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_WS_URL=ws://localhost:4000
```

### Mock Server Configuration

The mock server (server/mock-server.js) can be configured:

- Change PORT: Set `PORT` environment variable
- Adjust incident generation frequency: Edit `setInterval` duration (default: 10s)
- Customize mock data: Edit arrays in mock-server.js

## 🏗️ Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

Preview the production build:

```bash
npm run preview
```

## 🔍 Development Tips

### Hot Module Replacement

Vite provides instant HMR - changes appear immediately in the browser.

### Redux DevTools

Install Redux DevTools browser extension to inspect state and actions.

### TypeScript

The project is fully typed. Run type checking:

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

## 📚 Architecture Principles

This project follows the architecture defined in `monolithic.md`:

1. **Feature-Based Structure**: Code organized by domain feature
2. **Separation of Concerns**: UI, state, and business logic are separate
3. **Framework-Agnostic Services**: Services can work without React
4. **Real-time Ready**: WebSocket integration with Redux
5. **Micro-frontend Compatible**: Features are self-contained

## 🔗 API Endpoints

### REST API

- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/:id` - Get incident by ID
- `POST /api/incidents` - Create new incident
- `PATCH /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident

### WebSocket Messages

```json
{
  "type": "incident.created" | "incident.updated" | "incident.resolved",
  "payload": {
    "id": "string",
    "title": "string",
    "description": "string",
    "severity": "critical" | "high" | "medium" | "low",
    "status": "open" | "investigating" | "resolved",
    "service": "string",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 4000 is already in use:

**Frontend**: Edit `vite.config.ts` and change the port
**Backend**: Set `PORT=5000 npm start` (or any available port)

### WebSocket Connection Failed

- Ensure the mock server is running
- Check that `VITE_WS_URL` in `.env` matches the server URL
- Check browser console for specific error messages

### TypeScript Errors

Run type checking to see all errors:

```bash
npx tsc --noEmit
```
