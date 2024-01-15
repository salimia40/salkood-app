import { prisma } from "@/bin/db";
import {
  Group,
  Table,
  TableCaption,
  TableTd,
  TableTh,
  TableTr,
} from "@mantine/core";
import React from "react";
import PackageDrawer from "./PackageDrawer";
import Pagination from "@/bin/components/pagination";

export default async function PackagesTable({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const perPage = 20;
  const items = await prisma.package.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    include: {
      packageItems: true,
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: {
      id: "desc",
    },
  });

  const total = await prisma.package.count({
    where: {
      name: {
        contains: query,
      },
    },
  });

  const rows = items.map((item) => (
    <TableTr key={item.id}>
      <TableTd>{item.id}</TableTd>
      <TableTd>{item.name}</TableTd>
      <TableTd>
        <Group>
          <PackageDrawer mode="edit" package={item} />
          <PackageDrawer mode="view" package={item} />
        </Group>
      </TableTd>
    </TableTr>
  ));

  const headers = ["شناسه", "نام", "عملیات"];

  return (
    <Table captionSide="top">
      <thead>
        <TableTr>
          {headers.map((header) => (
            <TableTh key={header}>{header}</TableTh>
          ))}
        </TableTr>
      </thead>
      <tbody>{rows}</tbody>
      <TableCaption>
        <Group justify="space-between">
          <Pagination total={Math.ceil(total / perPage)} />
        </Group>
      </TableCaption>
    </Table>
  );
}
