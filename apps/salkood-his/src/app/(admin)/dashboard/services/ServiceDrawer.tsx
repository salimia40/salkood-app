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
  Select,
  Switch,
} from "@mantine/core";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { z } from "zod";
import { useCallback } from "react";
import {
  createService,
  deleteService,
  updateService,
} from "@/bin/actions/services";
import { Service, ServiceType } from "db";

type props =
  | {
      mode: "add";
      service?: undefined;
    }
  | {
      mode: "edit" | "view";
      service: Service;
    };

const initialValues = {
  name: "",
  price: 0,
  description: "",
  type: ServiceType.NURSE,
  enabled: true,
};

export default function GoodDrawer(props: props = { mode: "add" }) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<
    Pick<Service, "name" | "price" | "description" | "enabled" | "type">
  >({
    initialValues:
      props.mode === "edit" || props.mode === "view"
        ? {
            name: props.service.name,
            price: props.service.price,
            description: props.service.description,
            type: props.service.type,
            enabled: props.service.enabled,
          }
        : initialValues,
    validate: zodResolver(
      z.object({
        name: z.string().min(1, "نام را وارد کنید"),
        price: z.number().min(1, "قیمت را وارد کنید"),
        description: z.string().min(1, "توضیحات را وارد کنید"),
      }),
    ),
  });

  const handleSubmit = useCallback(async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    if (props.mode === "edit") {
      const result = await updateService({
        ...form.values,
        id: props.service.id,
      });
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

    const result = await createService(form.values);
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
    if (props.service) {
      const result = await deleteService(props.service.id);
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
      ? "ویرایش خدمت"
      : props.mode === "view"
        ? "مشاهده خدمت"
        : "افزودن خدمت";

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
              value={props.service.id}
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
          <Select
            withAsterisk
            required
            size="md"
            variant="filled"
            label="نوع"
            placeholder="نوع"
            disabled={props.mode === "view"}
            data={[
              { value: "LAB", label: "آزمایشگاه" },
              { value: "RADIOLOGY", label: "رادیولوژی" },
              { value: "PHARMACY", label: "داروخانه" },
              { value: "NURSE", label: "پرستار" },
              { value: "PHYSITION", label: "پزشک" },
            ]}
            {...form.getInputProps("type")}
          />
          <Switch
            disabled={props.mode === "view"}
            label="فعال"
            {...form.getInputProps("enabled", { type: "checkbox" })}
          />
          {props.mode === "add" && (
            <Button variant="light" onClick={handleSubmit}>
              {title}
            </Button>
          )}
          {props.mode === "edit" && (
            <Group grow>
              <Button variant="light" onClick={handleSubmit}>
                {title}
              </Button>
              <Button variant="light" color="red" onClick={handleDelete}>
                حذف خدمت
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
          {title}
        </Button>
      )}
    </>
  );
}
