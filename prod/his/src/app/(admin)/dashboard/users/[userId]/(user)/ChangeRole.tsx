"use client";

import { changeUserRole } from "@/bin/actions/users";
import {
  ActionIcon,
  Button,
  Group,
  Select,
  Stack,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconUserCog } from "@tabler/icons-react";
import { Modal } from "antd";
import { UserRole } from "db";
import React from "react";

export default function ChangeRole({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}) {
  const [opened, setOpened] = React.useState(false);

  const form = useForm<{
    role: UserRole;
  }>({
    initialValues: {
      role: role,
    },
  });

  const handleSubmit = () => {
    changeUserRole({
      userId,
      role: form.values.role,
    }).then(() => {
      notifications.show({
        title: "نقش کاربر با موفقیت تغییر کرد",
        message: "کاربر با موفقیت تغییر نقش کاربری انجام شد",
        color: "green",
        icon: <IconUserCog size={"1.5rem"} />,
      });

      setOpened(false);
    });
  };

  return (
    <>
      <Tooltip label="تغییر نقش">
        <ActionIcon
          variant="subtle"
          color="gray.7"
          onClick={() => setOpened(true)}
        >
          <IconUserCog size={"1.5rem"} />
        </ActionIcon>
      </Tooltip>
      <Modal
        open={opened}
        onCancel={() => setOpened(false)}
        footer={null}
        title="تغییر نقش کاربر"
      >
        <Stack gap="md">
          <Select
            label="نقش"
            {...form.getInputProps("role")}
            data={[
              { value: "USER", label: "کاربر عادی" },
              { value: "ADMIN", label: "ادمین" },
              { value: "NURSE", label: "پرستار" },
              { value: "PHYSITION", label: "پزشک" },
              { value: "SUPPORT", label: "پشتیبان" },
              { value: "ADDMITION", label: "مدیر" },
            ]}
            comboboxProps={{ withinPortal: false }}
          />
          <Group justify="flex-end">
            <Button onClick={handleSubmit}>ثبت</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
