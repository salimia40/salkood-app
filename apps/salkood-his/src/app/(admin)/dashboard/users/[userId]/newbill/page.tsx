"use client";
import {
  AppShellAside,
  AppShellMain,
  Grid,
  Stack,
  Card,
  Title,
  ActionIcon,
  Button,
  Box,
  Divider,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import React from "react";

import { Input, Select, Space } from "antd";
import ServiceSelect from "@/bin/components/select/ServiceSelect";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import GoodSelect from "@/bin/components/select/GoodSelect";
import { BillItemType } from "db";
import BillPreview from "./BillPreview";
import { useMediaQuery } from "@mantine/hooks";
import { z } from "zod";
import { createBill } from "@/bin/actions/bills";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

type FormValues = {
  items: {
    value: string;
    quantity: number;
    type: BillItemType;
  }[];
};

export default function Page({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const isPhone = useMediaQuery("(max-width: 62em)");
  const router = useRouter();

  const form = useForm<FormValues>({
    validateInputOnChange: true,
    initialValues: {
      items: [
        {
          value: "",
          quantity: 1,
          type: "GOOD",
        },
      ],
    },
    validate: zodResolver(
      z.object({
        items: z
          .array(
            z.object({
              value: z.string().min(1),
              quantity: z.number().min(1),
              type: z.nativeEnum(BillItemType),
            }),
          )
          .nonempty(),
      }),
    ),
  });

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    const items = form.values.items.filter((item) => item.value !== "");
    createBill({ userId: params.userId, items });
    notifications.show({
      title: "با موفقیت ثبت شد",
      message: "فاکتور جدید با موفقیت ثبت شد",
      color: "green",
      icon: <IconCheck size={16} />,
    });
    form.reset();
    router.push("/dashboard/users/" + params.userId + "/bills");
  };

  const fields = form.values.items.map((item, index) => (
    <Grid key={index}>
      <Grid.Col
        span={{
          base: 3,
          md: 2,
        }}
      >
        <Select
          options={[
            {
              value: "SERVICE",
              label: "خدمت",
            },
            {
              value: "GOOD",
              label: "محصول",
            },
            {
              value: "ADDITIONAL",
              label: "اضافه",
            },
          ]}
          value={item.type}
          onChange={(value) => {
            form.setFieldValue(`items.${index}.value`, "");
            form.setFieldValue(`items.${index}.type`, value);
          }}
          placeholder="انتخاب کنید"
          style={{ width: "100%" }}
        />
      </Grid.Col>
      <Grid.Col
        span={{
          base: 5,
          md: 7,
        }}
      >
        {item.type === "SERVICE" ? (
          <ServiceSelect
            value={item.value}
            onChange={(value) => {
              form.setFieldValue(`items.${index}.value`, value);
            }}
          />
        ) : item.type === "GOOD" ? (
          <GoodSelect
            value={item.value}
            onChange={(value) => {
              form.setFieldValue(`items.${index}.value`, value);
            }}
          />
        ) : (
          <Input
            value={item.value}
            onChange={(event) => {
              form.setFieldValue(
                `items.${index}.value`,
                event.currentTarget.value,
              );
            }}
          />
        )}
      </Grid.Col>
      <Grid.Col span={{ base: 3, md: 2 }}>
        <Input
          type={"number"}
          value={item.quantity}
          onChange={(event) => {
            form.setFieldValue(
              `items.${index}.quantity`,
              Number(event.currentTarget.value),
            );
          }}
        />
      </Grid.Col>
      <Grid.Col span={1}>
        <ActionIcon
          onClick={() => {
            form.removeListItem("items", index);
          }}
          color={"red"}
          variant={"light"}
        >
          <IconMinus />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  ));

  return (
    <>
      {!isPhone && (
        <AppShellAside>
          <Box p="sm" style={{ width: "100%" }}>
            <BillPreview onSubmit={handleSubmit} items={form.values.items} />
          </Box>
        </AppShellAside>
      )}
      <AppShellMain>
        <form>
          <Stack>
            <Card withBorder shadow="sm" radius="md" p="md" mt="md">
              <Title order={5}>
                <Space>ثبت فاکتور</Space>
              </Title>
              <Grid my={"md"}>
                <Grid.Col span={{ base: 3, md: 2 }}>
                  <Title order={6}>نوع</Title>
                </Grid.Col>
                <Grid.Col span={{ base: 5, md: 7 }}>
                  <Title order={6}>خدمت یا محصول </Title>
                </Grid.Col>
                <Grid.Col span={{ base: 4, md: 2 }}>
                  <Title order={6}>تعداد یا قیمت </Title>
                </Grid.Col>
              </Grid>
              {fields}
            </Card>
            <Button
              onClick={() => {
                form.insertListItem("items", {
                  value: "",
                  quantity: 1,
                  type: "GOOD",
                });
              }}
              variant="default"
            >
              + افزودن آیتم
            </Button>
          </Stack>
        </form>
        {isPhone && (
          <>
            <Divider my="md" />
            <BillPreview onSubmit={handleSubmit} items={form.values.items} />
          </>
        )}
      </AppShellMain>
    </>
  );
}
