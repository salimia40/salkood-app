self.addEventListener("notificationclick", (event) => {
  console.log(event);
});

self.addEventListener("install", () => {
  console.log("service worker installed");
});

self.addEventListener("activate", () => {
  console.log("service worker activated");
});

self.addEventListener("push", async (e) => {
  const event = e;
  const { notification } = await event.data.json();
  self.registration.showNotification(notification.title, {
    body: notification.body,
  });
});
