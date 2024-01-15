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
import ServiceDrawer from "./ServiceDrawer";
import { convertNumberToPersian, serviceTypeToPersian } from "@/bin/utils/text";
import Pagination from "../../../../bin/components/pagination";

export default async function GoodsTable({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const perPage = 20;
  const services = await prisma.service.findMany({
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

  const total = await prisma.service.count({
    where: {
      name: {
        contains: query,
      },
    },
  });

  const rows = services.map((service) => (
    <TableTr key={service.id}>
      <TableTd>{service.id}</TableTd>
      <TableTd>{service.name}</TableTd>
      <TableTd>{convertNumberToPersian(service.price)} ریال</TableTd>
      <TableTd>{serviceTypeToPersian(service.type)}</TableTd>
      <TableTd>{service.enabled ? "فعال" : "غیر فعال"}</TableTd>
      <TableTd>
        <Group>
          <ServiceDrawer mode="edit" service={service} />
          <ServiceDrawer mode="view" service={service} />
        </Group>
      </TableTd>
    </TableTr>
  ));

  const headers = ["شناسه", "نام", "قیمت", "نوع", "فعال", "عملیات"];

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
