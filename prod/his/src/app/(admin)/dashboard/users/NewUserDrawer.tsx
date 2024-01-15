"use client";

import { createNewUser } from "@/bin/actions/users";
import { Button, Select, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Drawer } from "antd";
import { UserRole } from "db";
import React from "react";
import { z } from "zod";

type FormValues = {
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  role: UserRole;
};

function NewUserDrawer() {
  const [opened, setOpened] = React.useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      nationalId: "",
      phone: "",
      role: "USER",
    },
    validate: zodResolver(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        nationalId: z.string().length(10),
        phone: z.string().length(11),
        role: z.enum([
          "USER",
          "ADMIN",
          "NURSE",
          "PHYSITION",
          "SUPPORT",
          "ADDMITION",
        ]),
      }),
    ),
  });

  const handleSubmit = async () => {
    if (form.validate().hasErrors) return;
    const res = await createNewUser({
      ...form.values,
      name: `${form.values.firstName} ${form.values.lastName}`,
    });

    if (!res.success) {
      notifications.show({
        title: "خطا",
        message: res.message,
        color: "red",
      });
      return;
    }

    notifications.show({
      title: "موفق",
      message: "کاربر با موفقیت ایجاد شد",
      color: "green",
    });
    setOpened(false);
    form.reset();
  };

  return (
    <>
      <Drawer
        open={opened}
        onClose={() => setOpened(false)}
        title="ایجاد کاربر"
        extra={<Button onClick={handleSubmit}> ایجاد کاربر</Button>}
      >
        <Stack gap="md">
          <TextInput label="نام" {...form.getInputProps("firstName")} />
          <TextInput label="نام خانوادگی" {...form.getInputProps("lastName")} />
          <TextInput label="کد ملی" {...form.getInputProps("nationalId")} />
          <TextInput label="شماره تلفن" {...form.getInputProps("phone")} />
          <Select
            label="نقش"
            {...form.getInputProps("role")}
            data={[
              { value: "USER", label: "کاربر" },
              { value: "ADMIN", label: "مدیر" },
              { value: "NURSE", label: "پرستار" },
              { value: "PHYSITION", label: "پزشک" },
              { value: "SUPPORT", label: "پشتیبانی" },
              { value: "ADDMITION", label: "پذیرش" },
            ]}
            comboboxProps={{ withinPortal: false }}
          />
        </Stack>
      </Drawer>
      <Button onClick={() => setOpened(true)}>ایجاد کاربر</Button>
    </>
  );
}

export default NewUserDrawer;
