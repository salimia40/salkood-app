"use client";
import React, { useCallback, useEffect } from "react";
import { subscribe } from "../../actions/auth";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Dialog, Group, Text, Tooltip } from "@mantine/core";
import { IconBellPlus } from "@tabler/icons-react";

function NotificationRegister() {
  const [opened, { open, close }] = useDisclosure(false);
  const [registration, setRegistration] =
    React.useState<ServiceWorkerRegistration | null>();

  const [subscribed, setSubscribed] = React.useState(false);

  useEffect(() => {
    (async () => {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        type: "module",
      });
      setRegistration(registration);

      const permission = await Notification.permission;
      if (permission !== "granted") return open();
      let sub = await registration.pushManager.getSubscription();
      if (!sub) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });
        setSubscribed(false);
      } else {
        setSubscribed(true);
        const _sub = sub.toJSON();
        await subscribe({
          endpoint: _sub.endpoint!,
          auth: _sub.keys!.auth,
          p256dh: _sub.keys!.p256dh,
        });
      }
    })();
  }, [open]);

  const handleSubscribe = useCallback(async () => {
    console.log("handleSubscribe", registration);
    if (!registration) return;
    if (subscribed) return close();
    const permission = await Notification.requestPermission();
    if (permission === "denied") return setSubscribed(false);
    let sub = await registration.pushManager.getSubscription();
    if (!sub) {
      sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
    }
    const _sub = sub.toJSON();
    await subscribe({
      endpoint: _sub.endpoint!,
      auth: _sub.keys!.auth,
      p256dh: _sub.keys!.p256dh,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.__SUB_ENDPOINT = _sub.endpoint!;
    setSubscribed(true);
    close();
  }, [close, registration, subscribed]);

  return (
    <Dialog opened={opened && !subscribed} withCloseButton onClose={close}>
      <Group>
        <Tooltip label="فعال سازی اعلان ها">
          <ActionIcon onClick={handleSubscribe} variant="transparent">
            <IconBellPlus size={"1.5rem"} />
          </ActionIcon>
        </Tooltip>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            فعال سازی اعلان ها
          </Text>
          <Text size="sm" c="dimmed">
            برای دریافت سریع تر اعلان ها کافیه اینجا کلیک کنید
          </Text>
        </div>
      </Group>
    </Dialog>
  );
}

export default NotificationRegister;
