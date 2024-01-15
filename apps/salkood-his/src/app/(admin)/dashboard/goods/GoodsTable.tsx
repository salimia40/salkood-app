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
import GoodDrawer from "./GoodDrawer";
import { convertNumberToPersian } from "@/bin/utils/text";
import Pagination from "@/bin/components/pagination";

export default async function GoodsTable({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const perPage = 20;
  const goods = await prisma.good.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: {
      id: "desc",
    },
  });

  const total = await prisma.good.count({
    where: {
      name: {
        contains: query,
      },
    },
  });

  const rows = goods.map((good) => (
    <TableTr key={good.id}>
      <TableTd>{good.id}</TableTd>
      <TableTd>{good.name}</TableTd>
      <TableTd>{convertNumberToPersian(good.price)} ریال</TableTd>
      <TableTd>{convertNumberToPersian(good.quantity)}</TableTd>
      <TableTd>
        <Group>
          <GoodDrawer mode="edit" good={good} />
          <GoodDrawer mode="view" good={good} />
        </Group>
      </TableTd>
    </TableTr>
  ));

  const headers = ["شناسه", "نام", "قیمت", "موجودی", "عملیات"];

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
