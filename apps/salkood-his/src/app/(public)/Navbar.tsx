"use client";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { AppShell, Burger, Group, UnstyledButton } from "@mantine/core";
import classes from "./Navbar.module.css";
import Logo from "@/bin/components/Logo";
import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({
  children,
  authButtons,
}: {
  children: React.ReactNode;
  authButtons: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const pinned = useHeadroom({ fixedAt: 120 });

  const _links = links.map((link) => (
    <UnstyledButton
      key={link.label}
      component={Link}
      href={link.href}
      className={classes.control}
    >
      {link.label}
    </UnstyledButton>
  ));

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Logo size={30} />
            <Group ml="xl" gap={0} visibleFrom="sm">
              {_links}
              {authButtons}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        {_links}
        {authButtons}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
