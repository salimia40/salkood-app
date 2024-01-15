import { Stack, Title, Button, Table } from "@mantine/core";
import React from "react";
import { prisma } from "@/bin/db";
import Link from "next/link";
import { format } from "date-fns-jalali";
import BillViewDrawer from "./BillViewDrawer";

export default async function Bills(props: { userId: string }) {
  const userId = props.userId;
  const bills = await prisma.bill.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      billItems: {
        include: {
          good: true,
          service: true,
        },
      },
    },
  });

  const tableData = {
    head: ["شماره فاکتور", "مبلغ", "تاریخ ثبت", "وضعیت", "مشاهده فاکتور"],
    body: bills.map((bill) => [
      bill.id,
      bill.amountDue.toLocaleString("fa-IR", {
        currency: "IRR",
        style: "currency",
      }),
      format(bill.createdAt, "yyyy/MM/dd HH:mm"),

      bill.isPaid ? "پرداخت شده" : "پرداخت نشده",
      <BillViewDrawer key={bill.id} bill={bill} />,
    ]),
  };

  if (bills.length === 0) {
    return (
      <Stack align="center" mt="xl">
        <Title order={3}>فاکتوری وجود ندارد</Title>
        <Button component={Link} href={`/dashboard/users/${userId}/newbill`}>
          افزودن فاکتور
        </Button>
      </Stack>
    );
  }

  return <Table captionSide="top" my={"lg"} data={tableData} />;
}
