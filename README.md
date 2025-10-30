# Incident Management Dashboard

A real-time incident monitoring dashboard built with React, Redux Toolkit, and WebSocket.

## Features

- 🔴 Real-time incident updates via WebSocket
- 🎯 Feature-based monolithic architecture
- 📊 Redux Toolkit for state management
- 🎨 Tailwind CSS for styling
- 🌍 i18n support (English & French)
- ♿ Accessible UI with ARIA support
- ⚡ Virtualized lists for high performance
- 🔌 Graceful WebSocket reconnection

## Architecture

This project follows a **feature-based monolithic architecture** with:
- Clean separation of UI, state, and business logic
- Framework-agnostic services
- Micro-frontend ready structure

See `monolithic.md` for detailed architecture documentation.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├─ app/              # Redux store & root component
├─ features/         # Feature modules (incidents)
├─ core/             # Shared utilities (HTTP, WebSocket)
├─ locales/          # i18n translations
└─ styles/           # Global styles
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_WS_URL=ws://localhost:4000
```

## WebSocket Protocol

The dashboard expects WebSocket messages in the following format:

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
    "createdAt": "ISO8601 timestamp",
    "updatedAt": "ISO8601 timestamp"
  }
}
```

## License

MIT

