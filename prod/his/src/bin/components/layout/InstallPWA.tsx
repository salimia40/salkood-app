"use client";
import { Dialog, Group, Text, ActionIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect } from "react";
import { IconDownload } from "@tabler/icons-react";

function InstallPWA({ loggedIn }: { loggedIn: boolean }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<Event | null>(
    null,
  );

  useEffect(() => {
    const installPWA = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (loggedIn && e) {
        open();
      }
    };

    const closePWA = (e: Event) => {
      e.preventDefault();
      close();
      setDeferredPrompt(null);
      console.log("PWA was installed");
    };

    window.addEventListener("beforeinstallprompt", installPWA);
    window.addEventListener("appinstalled", closePWA);

    return () => {
      window.removeEventListener("beforeinstallprompt", installPWA);
      window.removeEventListener("appinstalled", closePWA);
    };
  }, [close, deferredPrompt, loggedIn, open]);

  const handleInstall = () => {
    if (!deferredPrompt) {
      return;
    }
    close();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (deferredPrompt as any)?.prompt();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (deferredPrompt as any)?.userChoice
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        close();
      })
      .catch((err: Error) => {
        console.error(err);
      });
  };

  return (
    <Dialog opened={opened} onClose={close} withCloseButton>
      <Group>
        <Tooltip label="نصب">
          <ActionIcon onClick={handleInstall} variant="subtle">
            <IconDownload size={"1.5rem"} />
          </ActionIcon>
        </Tooltip>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            نصب وب اپلیکیشن سالکود
          </Text>
          <Text size="xs">برای دسترسی آسان تر، وب اپلیکیشن را نصب کنید.</Text>
        </div>
      </Group>
    </Dialog>
  );
}

export default InstallPWA;
