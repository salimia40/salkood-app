"use client";
import { useDisclosure } from "@mantine/hooks";
import {
  Drawer,
  Button,
  ScrollArea,
  Stack,
  TextInput,
  NumberInput,
  Textarea,
  ActionIcon,
  Group,
} from "@mantine/core";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { z } from "zod";
import { useCallback } from "react";
import { createGood, deleteGood, updateGood } from "@/bin/actions/goods";
import { Good } from "db";

type props =
  | {
      mode: "add";
      good?: undefined;
    }
  | {
      mode: "edit" | "view";
      good: Good;
    };

const initialValues = {
  name: "",
  price: 0,
  staffPrice: 0,
  quantity: 0,
  description: "",
};

export default function GoodDrawer(props: props = { mode: "add" }) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues:
      props.mode === "edit" || props.mode === "view"
        ? {
            name: props.good.name,
            price: props.good.price,
            description: props.good.description,
            staffPrice: props.good.staffPrice || 0,
            quantity: props.good.quantity || 0,
          }
        : initialValues,
    validate: zodResolver(
      z.object({
        name: z.string().min(1, "نام را وارد کنید"),
        price: z.number().min(1, "قیمت را وارد کنید"),
        description: z.string().min(1, "توضیحات را وارد کنید"),
        staffPrice: z.number().min(1, "قیمت کارمند را وارد کنید"),
        quantity: z.number().min(1, "تعداد را وارد کنید"),
      }),
    ),
  });

  const handleSubmit = useCallback(async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    if (props.mode === "edit") {
      const result = await updateGood({ ...form.values, id: props.good.id });
      if (result.success) {
        notifications.show({
          title: "موفق",
          message: result.message,
          color: "green",
        });
        form.reset();
      } else {
        notifications.show({
          title: "خطا",
          message: result.message,
          color: "red",
        });
      }
      close();
      return;
    }

    const result = await createGood(form.values);
    if (result.success) {
      notifications.show({
        title: "موفق",
        message: result.message,
        color: "green",
      });
      form.reset();
    } else {
      notifications.show({
        title: "خطا",
        message: result.message,
        color: "red",
      });
    }
    close();
  }, [close, form, props]);

  const handleDelete = useCallback(async () => {
    if (props.good) {
      const result = await deleteGood(props.good.id);
      if (result.success) {
        notifications.show({
          title: "موفق",
          message: result.message,
          color: "green",
        });
      } else {
        notifications.show({
          title: "خطا",
          message: result.message,
          color: "red",
        });
      }
    }
  }, [props]);

  const icon =
    props.mode === "edit" ? (
      <IconEdit />
    ) : props.mode === "view" ? (
      <IconEye />
    ) : (
      <IconPlus />
    );

  const title =
    props.mode === "edit"
      ? "ویرایش محصول"
      : props.mode === "view"
        ? "مشاهده محصول"
        : "افزودن محصول";

  return (
    <>
      <Drawer
        offset={8}
        radius="md"
        opened={opened}
        onClose={close}
        title={title}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Stack>
          {props.mode !== "add" && (
            <TextInput
              size="md"
              variant="filled"
              label="شناسه"
              disabled
              value={props.good.id}
            />
          )}
          <TextInput
            withAsterisk
            required
            size="md"
            variant="filled"
            label="نام"
            disabled={props.mode === "view"}
            placeholder="نام"
            {...form.getInputProps("name")}
          />
          <NumberInput
            withAsterisk
            required
            disabled={props.mode === "view"}
            pattern="[0-9۰-۹]*"
            min={1}
            size="md"
            variant="filled"
            label="قیمت"
            placeholder="قیمت"
            {...form.getInputProps("price")}
          />
          <NumberInput
            withAsterisk
            required
            disabled={props.mode === "view"}
            pattern="[0-9۰-۹]*"
            min={1}
            size="md"
            variant="filled"
            label="قیمت کارمند"
            placeholder="قیمت کارمند"
            {...form.getInputProps("staffPrice")}
          />
          <NumberInput
            withAsterisk
            required
            disabled={props.mode === "view"}
            pattern="[0-9۰-۹]*"
            min={1}
            size="md"
            variant="filled"
            label="تعداد"
            placeholder="تعداد"
            {...form.getInputProps("quantity")}
          />
          <Textarea
            disabled={props.mode === "view"}
            withAsterisk
            required
            size="md"
            variant="filled"
            label="توضیحات"
            placeholder="توضیحات"
            {...form.getInputProps("description")}
          />
          {props.mode === "add" && (
            <Button variant="light" onClick={handleSubmit}>
              افزودن محصول
            </Button>
          )}
          {props.mode === "edit" && (
            <Group grow>
              <Button variant="light" onClick={handleSubmit}>
                ویرایش محصول
              </Button>
              <Button variant="light" color="red" onClick={handleDelete}>
                حذف محصول
              </Button>
            </Group>
          )}
        </Stack>
      </Drawer>
      {props.mode === "view" || props.mode === "edit" ? (
        <ActionIcon variant="outline" onClick={open}>
          {icon}
        </ActionIcon>
      ) : (
        <Button onClick={open} leftSection={icon} variant="outline">
          افزودن محصول
        </Button>
      )}
    </>
  );
}
