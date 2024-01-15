import { Box, Group, Text } from "@mantine/core";
import { BillItemType } from "db";
import { Typography } from "antd";
import React from "react";

export default function BillItem({
  item,
}: {
  item: {
    label: string;
    price: number;
    total: number;
    quantity: number;
    type: BillItemType;
  };
}) {
  if (!item.label) {
    return null;
  }

  return (
    <Box style={{ width: "100%" }}>
      <Group justify="space-between">
        <Typography.Text style={{ textAlign: "center" }}>
          {item.label}{" "}
          <Typography.Text style={{ color: "darkgray" }}>
            {item.type === "GOOD"
              ? "محصول"
              : item.type === "ADDITIONAL"
                ? "اضافه"
                : "خدمت"}
          </Typography.Text>
          {item.type !== "ADDITIONAL" && (
            <Typography.Text
              style={{ color: "darkgray" }}
            >{`: ${item.quantity}`}</Typography.Text>
          )}
        </Typography.Text>
        <Typography.Text style={{}}>
          {item.total.toLocaleString()} ریال
        </Typography.Text>
      </Group>
      {item.type !== "ADDITIONAL" && (
        <Group justify="space-between" c={"gray.5"}>
          <Text size="xs">قیمت فی:</Text>
          <Text size="xs">{item.price.toLocaleString()} ریال</Text>
        </Group>
      )}
    </Box>
  );
}
