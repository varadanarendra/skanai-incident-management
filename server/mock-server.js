/**
 * Mock WebSocket + REST API Server for Testing
 * Run with: node server/mock-server.js
 */

import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Mock data
const severities = ["critical", "high", "medium", "low"];
const statuses = ["open", "investigating", "resolved"];
const services = [
  "API Gateway",
  "Auth Service",
  "Database",
  "Payment Service",
  "Email Service",
  "Storage",
];

const titles = [
  "High latency in API responses",
  "Database connection pool exhausted",
  "Payment processing failures",
  "Email delivery delays",
  "Increased error rate in authentication",
  "Storage service unavailable",
  "Memory leak detected in service",
  "Rate limiting triggered",
  "SSL certificate expiring soon",
  "Disk space running low",
];

const descriptions = [
  "Users are experiencing slow response times when accessing the service.",
  "Multiple connection timeouts have been detected in the last 15 minutes.",
  "Service is returning 500 errors for approximately 10% of requests.",
  "Automated monitoring has detected an anomaly in the service behavior.",
  "Resource utilization has exceeded normal thresholds.",
];

function generateIncident() {
  const id = `incident-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const service = services[Math.floor(Math.random() * services.length)];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const description =
    descriptions[Math.floor(Math.random() * descriptions.length)];

  return {
    id,
    title,
    description,
    severity,
    status,
    service,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Generate initial incidents (2000 records)
let incidents = Array.from({ length: 2000 }, () => generateIncident());

// REST API Endpoints
app.get("/api/incidents", (req, res) => {
  // Query params: page, limit, search, severity, status, service
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 25, 1), 200);
  const search = (req.query.search || "").toString().toLowerCase();
  const severity = (req.query.severity || "all").toString();
  const status = (req.query.status || "all").toString();
  const service = (req.query.service || "all").toString();

  let filtered = incidents;

  if (severity !== "all") {
    filtered = filtered.filter((i) => i.severity === severity);
  }
  if (status !== "all") {
    filtered = filtered.filter((i) => i.status === status);
  }
  if (service !== "all") {
    filtered = filtered.filter((i) => i.service === service);
  }
  if (search) {
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(search) ||
        i.description.toLowerCase().includes(search) ||
        i.service.toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  // Aggregates before slicing (global across all filtered records)
  const countsBySeverity = {
    critical: filtered.filter((i) => i.severity === "critical").length,
    high: filtered.filter((i) => i.severity === "high").length,
    medium: filtered.filter((i) => i.severity === "medium").length,
    low: filtered.filter((i) => i.severity === "low").length,
    total,
  };

  const countsByStatus = {
    open: filtered.filter((i) => i.status === "open").length,
    investigating: filtered.filter((i) => i.status === "investigating").length,
    resolved: filtered.filter((i) => i.status === "resolved").length,
    total,
  };
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const data = filtered.slice(start, end);

  res.json({
    data,
    page: currentPage,
    limit,
    total,
    totalPages,
    countsBySeverity,
    countsByStatus,
  });
});

app.get("/api/incidents/:id", (req, res) => {
  const incident = incidents.find((i) => i.id === req.params.id);
  if (incident) {
    res.json(incident);
  } else {
    res.status(404).json({ error: "Incident not found" });
  }
});

app.post("/api/incidents", (req, res) => {
  const incident = {
    ...generateIncident(),
    ...req.body,
  };
  incidents.push(incident);

  // Broadcast to all WebSocket clients
  broadcastIncident("incident.created", incident);

  res.status(201).json(incident);
});

app.patch("/api/incidents/:id", (req, res) => {
  const index = incidents.findIndex((i) => i.id === req.params.id);
  if (index !== -1) {
    incidents[index] = {
      ...incidents[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    // Broadcast to all WebSocket clients
    broadcastIncident("incident.updated", incidents[index]);

    res.json(incidents[index]);
  } else {
    res.status(404).json({ error: "Incident not found" });
  }
});

// Mark incident as resolved
app.patch("/api/incidents/:id/resolve", (req, res) => {
  const index = incidents.findIndex((i) => i.id === req.params.id);
  if (index !== -1) {
    incidents[index] = {
      ...incidents[index],
      status: "resolved",
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    broadcastIncident("incident.updated", incidents[index]);

    res.json(incidents[index]);
  } else {
    res.status(404).json({ error: "Incident not found" });
  }
});

app.delete("/api/incidents/:id", (req, res) => {
  const index = incidents.findIndex((i) => i.id === req.params.id);
  if (index !== -1) {
    incidents.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Incident not found" });
  }
});

// WebSocket handling
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "connection.established",
      payload: { message: "Connected to incident stream" },
    })
  );
});

// Broadcast incident to all connected clients
function broadcastIncident(type, incident) {
  const message = JSON.stringify({
    type,
    payload: incident,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Simulate random incidents
setInterval(() => {
  if (Math.random() > 0.7) {
    const incident = generateIncident();
    incidents.push(incident);
    console.log(`Generated new incident: ${incident.id}`);
    broadcastIncident("incident.created", incident);
  }

  // Randomly update existing incidents
  if (incidents.length > 0 && Math.random() > 0.8) {
    const randomIndex = Math.floor(Math.random() * incidents.length);
    const incident = incidents[randomIndex];

    if (incident.status !== "resolved") {
      incident.status = statuses[Math.floor(Math.random() * statuses.length)];
      incident.updatedAt = new Date().toISOString();
      console.log(`Updated incident: ${incident.id}`);
      broadcastIncident("incident.updated", incident);
    }
  }
}, 10000); // Every 10 seconds

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
  console.log(`REST API available at http://localhost:${PORT}/api`);
});
