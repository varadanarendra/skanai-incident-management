export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (!isNotificationSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

interface NewIncidentPayload {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  service: string;
}

export async function notifyNewIncident(
  payload: NewIncidentPayload
): Promise<void> {
  if (!isNotificationSupported()) return;
  const permission = await requestNotificationPermission();
  if (permission !== "granted") return;

  const severityEmoji: Record<string, string> = {
    critical: "🚨",
    high: "⚠️",
    medium: "🔔",
    low: "ℹ️",
  };

  const title = `${severityEmoji[payload.severity] || "🔔"} New ${
    payload.severity
  } incident`;
  const body = `${payload.title} • ${payload.service}`;

  try {
    const n = new Notification(title, {
      body,
      tag: payload.id, // collapse duplicates
    });

    // Auto close after 5s
    setTimeout(() => n.close(), 5000);
  } catch {
    // no-op
  }
}
