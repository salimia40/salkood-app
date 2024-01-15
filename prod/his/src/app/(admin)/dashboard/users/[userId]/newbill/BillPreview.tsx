import { Button, Group, Stack, Text } from "@mantine/core";
import { BillItemType, Good, Service } from "db";
import React from "react";
import BillItem from "./BillItem";
import { getGood } from "@/bin/actions/goods";
import { getService } from "@/bin/actions/services";
import { Divider } from "antd";

export default function BillPreview(props: {
  items: {
    value: string;
    quantity: number;
    type: BillItemType;
  }[];
  onSubmit: () => void;
}) {
  const [items, setItems] = React.useState<(Service | Good)[]>();

  React.useEffect(() => {
    (async () => {
      const newItems: (Service | Good)[] = [];
      for (const item of props.items) {
        if (item.value === "") continue;
        // else if (items?.some((i) => i.id === item.value)) continue;
        else if (item.type === "ADDITIONAL") continue;
        else if (item.type === "GOOD") {
          const good = await getGood(item.value);
          if (good) newItems.push(good);
        } else if (item.type === "SERVICE") {
          const service = await getService(item.value);
          if (service) newItems.push(service);
        }
      }
      setItems(newItems);
    })();
  }, [props.items]);

  const isEmpty =
    props.items.length === 0 || props.items?.every((i) => i.value.length === 0);

  let amountDue = 0;

  for (const item of props.items) {
    let pricePerUnit = 0;
    if (item.type === "GOOD") {
      pricePerUnit = items?.find((i) => i.id === item.value)?.price || 0;
    } else if (item.type === "SERVICE") {
      pricePerUnit = items?.find((i) => i.id === item.value)?.price || 0;
    } else {
      pricePerUnit = item.quantity;
    }
    if (item.type !== "ADDITIONAL") {
      amountDue += pricePerUnit * item.quantity;
    } else {
      amountDue += pricePerUnit;
    }
  }

  const maintenanceFee = 0.01 * amountDue + 10_000;
  const subTotal = amountDue + maintenanceFee;
  const tax = 0.09 * amountDue;

  const total = subTotal + tax;

  return (
    <Stack gap={"sx"}>
      <Button onClick={props.onSubmit} disabled={isEmpty} variant={"default"}>
        ثبت فاکتور
      </Button>
      {isEmpty ? (
        <Text ta={"center"}>هیچ آیتمی اضافه نشده است</Text>
      ) : (
        <div>
          <Group justify="space-between" align="center">
            <Text size="sm" c="gray.6">
              مجموع:
            </Text>
            <Text size="sm" c="gray.6">
              {amountDue.toLocaleString()} ریال
            </Text>
          </Group>

          <Group justify="space-between" align="center">
            <Text size="sm" c="gray.6">
              هزینه سیستم:
            </Text>
            <Text size="sm" c="gray.6">
              {maintenanceFee.toLocaleString()} ریال
            </Text>
          </Group>
          <Group justify="space-between" align="center">
            <Text size="sm" c="gray.6">
              مالیات:
            </Text>
            <Text size="sm" c="gray.6">
              {tax.toLocaleString()} ریال
            </Text>
          </Group>
          <Group justify="space-between" align="center">
            <Text size="sm" c="gray.6">
              قابل پرداخت:
            </Text>
            <Text size="sm" c="gray.6">
              {total.toLocaleString()} ریال
            </Text>
          </Group>
          <Divider />
        </div>
      )}
      {props.items.map((item, index) => {
        if (item.value === "") return null;
        const pricePerUnit =
          item.type !== "ADDITIONAL"
            ? items?.find((i) => i.id === item.value)?.price || 0
            : 0;
        const total =
          item.type !== "ADDITIONAL"
            ? pricePerUnit * item.quantity
            : item.quantity;

        const label =
          item.type !== "ADDITIONAL"
            ? items?.find((i) => i.id === item.value)?.name || ""
            : item.value;

        return (
          <BillItem
            key={index}
            item={{
              label: label,
              price: pricePerUnit,
              total: total,
              quantity: item.quantity,
              type: item.type,
            }}
          />
        );
      })}
    </Stack>
  );
}
