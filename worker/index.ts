/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_NOTIFICATION") {
    const { title, body, icon, tag } = event.data;
    self.registration.showNotification(title || "Soul Sync", {
      body: body || "You have a new notification",
      icon: icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      tag: tag || "soul-sync-general",
      vibrate: [100, 50, 100],
    });
  }
});

self.addEventListener("push", (event) => {
  let data = { title: "Soul Sync", body: "You have a new update!", icon: "/icons/icon-192x192.png" };
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: "/icons/icon-96x96.png",
      vibrate: [100, 50, 100],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      return self.clients.openWindow("/");
    })
  );
});
