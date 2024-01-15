"use client";

import { chargeInventory } from "@/bin/actions/inventory";
import PackageSelect from "@/bin/components/select/PackageSelect";
import { ActionIcon, Stack, Tooltip, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconForklift } from "@tabler/icons-react";
import { Drawer } from "antd/lib";
import React from "react";

export default function ChargeInventory({ userId }: { userId: string }) {
  const [opened, setOpened] = React.useState(false);

  const form = useForm<{
    packageId: string;
  }>({
    initialValues: {
      packageId: "",
    },
  });

  return (
    <>
      <Drawer
        open={opened}
        onClose={() => setOpened(false)}
        title="افزودن موجودی"
        extra={
          <Button
            onClick={() => {
              chargeInventory({
                userId,
                packageId: form.values.packageId,
              }).then(() => {
                notifications.show({
                  title: "موجودی کاربر با موفقیت افزوده شد",
                  message: "کاربر با موفقیت موجودی افزوده شد",
                  color: "green",
                });

                setOpened(false);
              });
            }}
          >
            ثبت
          </Button>
        }
      >
        <Stack>
          <PackageSelect
            value={form.values.packageId}
            onChange={(v) => {
              form.setFieldValue("packageId", v);
            }}
          />
        </Stack>
      </Drawer>
      <Tooltip label="افزودن موجودی">
        <ActionIcon
          variant="subtle"
          color="gray.7"
          onClick={() => setOpened(true)}
        >
          <IconForklift size={"1.5rem"} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
