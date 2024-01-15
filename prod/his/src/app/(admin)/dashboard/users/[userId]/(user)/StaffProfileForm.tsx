"use client";

import { updateStaffProfile } from "@/bin/actions/users";
import {
  Button,
  Group,
  Input,
  InputWrapper,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconUserCog } from "@tabler/icons-react";
import { format, parse } from "date-fns-jalali";
import { StaffProfile } from "db";
import React from "react";
import { IMaskInput } from "react-imask";

function StaffProfileForm({
  staffProfile,
  userId,
}: {
  staffProfile?: StaffProfile;
  userId: string;
}) {
  const form = useForm({
    initialValues: {
      firstName: staffProfile?.firstName || "",
      lastName: staffProfile?.lastName || "",
      birthDate: format(staffProfile?.birthDate || new Date(), "yyyy/MM/dd"),
      title: staffProfile?.title || "",
      gender: staffProfile?.gender || "MALE",
    },
  });

  const handleSubmit = () => {
    const { birthDate, ...values } = form.values;
    updateStaffProfile({
      userId,
      birthDate: parse(birthDate, "yyyy/MM/dd", new Date()),
      ...values,
    }).then(() => {
      notifications.show({
        title: "نقش کاربر با موفقیت تغییر کرد",
        message: "کاربر با موفقیت تغییر نقش کاربری انجام شد",
        color: "green",
        icon: <IconUserCog size={"1.5rem"} />,
      });
    });
  };

  return (
    <Stack>
      <SimpleGrid cols={2} spacing="md">
        <TextInput label="نام" {...form.getInputProps("firstName")} />
        <TextInput label="نام خانوادگی" {...form.getInputProps("lastName")} />
      </SimpleGrid>
      <SimpleGrid cols={2} spacing="md">
        <InputWrapper
          label="تاریخ تولد"
          description="از حروف انگلیسی استفاده کنید."
          error={form.errors.birthDate}
        >
          <Input
            component={IMaskInput}
            placeholder="تاریخ تولد"
            {...form.getInputProps("birthDate")}
            onChange={form.getInputProps("birthDate").onChange}
            value={form.getInputProps("birthDate").value}
            mask="0000/00/00"
          />
        </InputWrapper>
        <TextInput label="عنوان" {...form.getInputProps("title")} />
      </SimpleGrid>
      <SimpleGrid cols={2} spacing="md">
        <TextInput label="جنسیت" {...form.getInputProps("gender")} />
      </SimpleGrid>
      <Group>
        {form.isDirty() && (
          <Button variant="outline" onClick={() => handleSubmit()}>
            ذخیره تغییرات
          </Button>
        )}
      </Group>
    </Stack>
  );
}

export default StaffProfileForm;
