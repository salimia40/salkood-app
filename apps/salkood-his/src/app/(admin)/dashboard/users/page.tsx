import React from "react";
import { prisma } from "@/bin/db";
import { ActionIcon, AppShellMain, Group, Table, Title } from "@mantine/core";
import { User } from "db";
import { userRoleToPersian } from "@/bin/utils/text";
import { format } from "date-fns-jalali";
import Search from "@/bin/components/Search";
import Pagination from "@/bin/components/pagination";
import { IconEye } from "@tabler/icons-react";
import Link from "next/link";
import NewUserDrawer from "./NewUserDrawer";

export default async function Page(props: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const where = {
    OR: [
      {
        firstName: {
          contains: props?.searchParams?.query || "",
        },
      },
      {
        lastName: {
          contains: props?.searchParams?.query || "",
        },
      },
      {
        nationalId: {
          contains: props?.searchParams?.query || "",
        },
      },
      {
        phone: {
          contains: props?.searchParams?.query || "",
        },
      },
    ],
  };

  const users = await prisma.user.findMany({
    where,
    take: 20,
    skip: (Number(props?.searchParams?.page) - 1) * 20 || 0,
    orderBy: {
      nationalId: "desc",
    },
  });

  const total = await prisma.user.count({
    where,
  });

  const tableData = {
    head: [
      "نام",
      "نام خانوادگی",
      "شماره ملی",
      "شماره تلفن",
      "تاریخ عضویت",
      "نوع کاربر",
      "موجودی",
    ],
    body: users.map((user: User) => [
      // eslint-disable-next-line react/jsx-key
      <Group>
        <UserMenu
          userId={user.nationalId}
          name={`${user.firstName} ${user.lastName}`}
        />
        {user.firstName}
      </Group>,
      user.lastName,
      user.nationalId,
      user.phone,
      format(user.createdAt, "yyyy/MM/dd"),
      userRoleToPersian(user.role),
      user.charge.toLocaleString("fa-IR", {
        style: "currency",
        currency: "IRR",
      }),
    ]),
    caption: (
      <Group justify="space-between">
        <Title order={4}>لیست کاربران</Title>
        <Pagination total={Math.ceil(total / 20)} />
        <Group>
          <NewUserDrawer />
          <Search />
        </Group>
      </Group>
    ),
  };

  return (
    <AppShellMain>
      {/* @ts-expect-error caption works fine */}
      <Table data={tableData} captionSide="top" />
    </AppShellMain>
  );
}

function UserMenu({ userId }: { userId: string; name: string }) {
  return (
    <ActionIcon
      variant="subtle"
      color="gray.7"
      component={Link}
      href={`/dashboard/users/${userId}`}
    >
      <IconEye />
    </ActionIcon>
  );
}
