"use client";
import {
  Group,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Image,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { ReactNode } from "react";

export function Header({ auth }: { auth: ReactNode[] }) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ].map((link) => (
    <a key={link.label} href={link.href} className={classes.link}>
      {link.label}
    </a>
  ));

  return (
    <Box py={"md"} bg="gray.2">
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group>
            <Image src="/logo.png" alt="" w="35" />
            <Title order={2}>Salkood</Title>
          </Group>

          <Group h="100%" gap={0} visibleFrom="sm">
            {links}
          </Group>

          <Group visibleFrom="sm">{auth}</Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          {links}
          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {auth}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
