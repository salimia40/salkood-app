"use client";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Text,
} from "@mantine/core";
import Logo from "@/bin/components/Logo";
import Link from "next/link";
import {
  IconCalendarClock,
  IconDatabase,
  IconGauge,
  IconHelp,
  IconHome,
  IconNotification,
  IconReceipt,
  IconSettings,
  IconUsers,
  IconVector,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

const links = [
  { label: "داشبورد", icon: IconGauge, href: "/dashboard" },
  {
    icon: IconUsers,
    label: "مدیریت کاربران",
    subLinks: [
      {
        label: "مشاهده کاربران",
        href: "/dashboard/users",
      },
      {
        label: "مشاهده بیماران",
        href: "/dashboard/patients",
      },
      {
        label: "مشاهده کارکنان",
        href: "/dashboard/users/staff",
      },
      {
        label: "مدیریت قرارداد ها",
        href: "/dashboard/contracts",
      },
    ],
  },
  // bills
  {
    icon: IconReceipt,
    label: "مدیریت فاکتور ها",
    subLinks: [
      {
        label: "مشاهده فاکتور ها",
        href: "/dashboard/bills",
      },
      // payments
      {
        label: "مشاهده پرداخت ها",
        href: "/dashboard/bills/payments",
      },
    ],
  },
  {
    label: "مدیریت نوبت ها",
    icon: IconCalendarClock,
    subLinks: [
      {
        label: "مشاهده نوبت ها",
        href: "/dashboard/appointments",
      },
      {
        label: "مشاهده درخواست ها",
        href: "/dashboard/appointments/requests",
      },
    ],
  },
  {
    icon: IconDatabase,
    label: "مدیریت دیتابیس",
    subLinks: [
      {
        label: "مدیریت محصولات",
        href: "/dashboard/goods",
      },
      {
        label: "مدیریت خدمات",
        href: "/dashboard/services",
      },
      {
        label: "مدیریت پکیج ها",
        href: "/dashboard/packages",
      },
      {
        label: "مدیریت وبلاگ",
        href: "/dashboard/blog",
      },
    ],
  },
  {
    icon: IconNotification,
    label: "اعلان ها",
    subLinks: [
      {
        label: "مشاهده اعلان ها",
        href: "/dashboard/notifications",
      },
      {
        label: "مشاهده اعلان های من",
        href: "/dashboard/notifications/my",
      },
    ],
  },
  {
    icon: IconHelp,
    label: "پشتیبانی",
    href: "/dashboard/support",
  },
  {
    icon: IconVector,
    label: "رویداد ها",
    href: "/dashboard/events",
  },
  {
    icon: IconSettings,
    label: "تنظیمات",
    href: "/dashboard/settings",
  },
];

export function AdminNavbar({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  const _links = links.map((link) =>
    link.href ? (
      <NavLink
        key={link.label}
        label={link.label}
        component={Link}
        leftSection={<link.icon size={"0.8rem"} />}
        href={link.href}
        style={{
          textAlign: "right",
        }}
      />
    ) : (
      <NavLink
        key={link.label}
        label={link.label}
        leftSection={<link.icon size={"0.8rem"} />}
        style={{
          textAlign: "right",
        }}
      >
        {link.subLinks &&
          link.subLinks.map((subLink) => (
            <NavLink
              key={subLink.label}
              label={subLink.label}
              component={Link}
              href={subLink.href}
              style={{
                textAlign: "right",
              }}
            />
          ))}
      </NavLink>
    ),
  );

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 30 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      aside={
        pathname.includes("/support") || pathname.includes("/newbill")
          ? {
              width: 300,
              breakpoint: "md",
              collapsed: { desktop: false, mobile: true },
            }
          : undefined
      }
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logo size={30} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {_links}
        </AppShell.Section>
        <AppShell.Section>
          <NavLink
            label="صفحه اصلی"
            component={Link}
            href="/"
            style={{
              textAlign: "right",
            }}
            leftSection={<IconHome size={"0.8rem"} />}
          />
        </AppShell.Section>
      </AppShell.Navbar>
      {/* root component of children should be AppShell.Main */}
      {children}
      <AppShell.Footer p="xs">
        <Text size="xs">dev by @puyaars</Text>
      </AppShell.Footer>
    </AppShell>
  );
}
