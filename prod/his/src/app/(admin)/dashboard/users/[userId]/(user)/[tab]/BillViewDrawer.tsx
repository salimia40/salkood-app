"use client";

import { ActionIcon, Box, Group, Stack, Text } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { Descriptions, Drawer, Typography } from "antd";
import { Bill, BillItem, Good, Service } from "db";
import React from "react";
import type { DescriptionsProps } from "antd";

export default function BillViewDrawer({
  bill,
}: {
  bill: Bill & {
    billItems: (BillItem & {
      good: Good | null;
      service: Service | null;
    })[];
  };
}) {
  const [opened, setOpened] = React.useState(false);

  const items = bill.billItems.map((item) => ({
    id: item.id,
    label: item.good?.name || item.service?.name || item.label,
    price: item.pricePerUnit,
    total: item.pricePerUnit * (item.quantity || 1),
    quantity: item.quantity || 1,
    typeLable:
      item.type === "ADDITIONAL"
        ? "اضافه"
        : item.type === "GOOD"
          ? "محصول"
          : "خدمت",
    type: item.type,
  }));

  const data: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "مالیات",
      children: `${(bill.tax || 0).toLocaleString()} ریال`,
    },
    {
      key: "2",
      label: "جمع کل",
      children: `${(bill.amountDue || 0).toLocaleString()} ریال`,
    },
  ];

  return (
    <>
      <Drawer
        open={opened}
        onClose={() => setOpened(false)}
        title="مشاهده سفارش"
      >
        <Stack>
          {items.map((item) => (
            <Box style={{ width: "100%" }} key={item.id}>
              <Group justify="space-between">
                <Typography.Text style={{ textAlign: "center" }}>
                  {item.label}{" "}
                  <Typography.Text style={{ color: "darkgray" }}>
                    {item.typeLable}
                  </Typography.Text>
                  {item.type !== "ADDITIONAL" && (
                    <Typography.Text
                      style={{ color: "darkgray" }}
                    >{`: ${item.quantity}`}</Typography.Text>
                  )}
                </Typography.Text>
                <Typography.Text style={{}}>
                  {(item.total || 0).toLocaleString()} ریال
                </Typography.Text>
              </Group>
              {item.type !== "ADDITIONAL" && (
                <Group justify="space-between" c={"gray.5"}>
                  <Text size="xs">قیمت فی:</Text>
                  <Text size="xs">{item.price.toLocaleString()} ریال</Text>
                </Group>
              )}
            </Box>
          ))}
          <Descriptions items={data} column={1} />
        </Stack>
      </Drawer>
      <ActionIcon
        variant="subtle"
        color="gray.7"
        onClick={() => setOpened(true)}
      >
        <IconEye />
      </ActionIcon>
    </>
  );
}
