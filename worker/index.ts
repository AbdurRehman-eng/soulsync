const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_NOTIFICATION") {
    const { title, body, icon, tag } = event.data;
    sw.registration.showNotification(title || "Soul Sync", {
      body: body || "You have a new notification",
      icon: icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      tag: tag || "soul-sync-general",
    });
  }
});

sw.addEventListener("push", (event) => {
  let data = { title: "Soul Sync", body: "You have a new update!", icon: "/icons/icon-192x192.png" };
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch {}

  event.waitUntil(
    sw.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: "/icons/icon-96x96.png",
    })
  );
});

sw.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    sw.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      return sw.clients.openWindow("/");
    })
  );
});
