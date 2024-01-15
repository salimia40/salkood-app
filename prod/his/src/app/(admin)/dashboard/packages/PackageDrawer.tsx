"use client";
import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Stack,
  TextInput,
  Textarea,
  ActionIcon,
  Group,
  NumberInput,
  SimpleGrid,
} from "@mantine/core";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { z } from "zod";
import { useCallback } from "react";
import { Package, PackageItem } from "db";
import { Drawer } from "antd";
import GoodSelect from "@/bin/components/select/GoodSelect";
import {
  createPackage,
  deletePackage,
  updatePackage,
} from "@/bin/actions/packages";

type props =
  | {
      mode: "add";
      package?: undefined;
    }
  | {
      mode: "edit" | "view";
      package: Package & {
        packageItems: PackageItem[];
      };
    };

const initialValues = {
  name: "",
  description: "",
  packageItems: [],
};

type FormValues = {
  name: string;
  description: string;
  packageItems: {
    goodId: string;
    quantity: number;
  }[];
};

export default function PackageDrawer(props: props = { mode: "add" }) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<FormValues>({
    initialValues:
      props.mode === "edit" || props.mode === "view"
        ? {
            name: props.package.name,
            description: props.package.description,
            packageItems: props.package.packageItems.map((item) => ({
              goodId: item.goodId,
              quantity: item.quantity,
            })),
          }
        : initialValues,
    validate: zodResolver(
      z.object({
        name: z.string().min(1, "نام را وارد کنید"),
        description: z.string().min(1, "توضیحات را وارد کنید"),
      }),
    ),
  });

  const handleSubmit = useCallback(async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    if (props.mode === "edit") {
      const result = await updatePackage({
        ...form.values,
        id: props.package.id,
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

    const result = await createPackage(form.values);
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

  const items = form.values.packageItems.map((item, index) => (
    <SimpleGrid cols={2} key={index}>
      <GoodSelect
        value={item.goodId}
        onChange={(value) => {
          form.setFieldValue(`packageItems.${index}.goodId`, value);
        }}
        placeholder="محصول را انتخاب کنید"
      />
      <Group>
        <NumberInput
          value={item.quantity}
          onChange={(value) => {
            form.setFieldValue(`packageItems.${index}.quantity`, value);
          }}
          style={{ flex: 1 }}
          placeholder="تعداد را وارد کنید"
        />
        <ActionIcon variant="light" color="red">
          <IconTrash />
        </ActionIcon>
      </Group>
    </SimpleGrid>
  ));

  const handleDelete = useCallback(async () => {
    if (props.package) {
      const result = await deletePackage(props.package.id);
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
      ? "ویرایش بسته"
      : props.mode === "view"
        ? "مشاهده بسته"
        : "افزودن بسته";

  return (
    <>
      <Drawer
        open={opened}
        onClose={close}
        title={title}
        size="large"
        extra={
          <>
            {props.mode === "add" && (
              <Button variant="light" onClick={handleSubmit}>
                افزودن بسته
              </Button>
            )}
            {props.mode === "edit" && (
              <Group grow>
                <Button variant="light" onClick={handleSubmit}>
                  ویرایش بسته
                </Button>
                <Button variant="light" color="red" onClick={handleDelete}>
                  حذف بسته
                </Button>
              </Group>
            )}
          </>
        }
      >
        <Stack>
          {props.mode !== "add" && (
            <TextInput
              size="md"
              variant="filled"
              label="شناسه"
              disabled
              value={props.package.id}
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
          {items}
          <Button
            onClick={() => form.insertListItem("packageItems", {})}
            variant="outline"
          >
            افزودن محصول
          </Button>
        </Stack>
      </Drawer>
      {props.mode === "view" || props.mode === "edit" ? (
        <ActionIcon variant="outline" onClick={open}>
          {icon}
        </ActionIcon>
      ) : (
        <Button onClick={open} leftSection={icon} variant="outline">
          افزودن بسته
        </Button>
      )}
    </>
  );
}
