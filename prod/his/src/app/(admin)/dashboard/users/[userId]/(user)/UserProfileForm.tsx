"use client";

import {
  Button,
  Group,
  Input,
  InputWrapper,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { UserProfile } from "db";
import { updateUserProfile } from "@/bin/actions/users";
import { useCallback } from "react";
type FormValues = Pick<
  UserProfile,
  | "firstName"
  | "lastName"
  | "addictions"
  | "gender"
  | "allergies"
  | "conditions"
  | "familyHistory"
  | "medications"
  | "socialHistory"
  | "surgeries"
> & {
  birthDate: string;
};

import { IMaskInput } from "react-imask";
import { format, parse } from "date-fns-jalali";

export default function UserProfileForm({
  userProfile,
  userId,
}: {
  userId: string;
  userProfile?: UserProfile;
}) {
  const form = useForm<FormValues>({
    initialValues: !userProfile
      ? {
          firstName: "",
          lastName: "",
          gender: "MALE",
          birthDate: format(new Date(), "yyyy/MM/dd"),
          conditions: "",
          allergies: "",
          familyHistory: "",
          socialHistory: "",
          medications: "",
          surgeries: "",
          addictions: "",
        }
      : {
          firstName: userProfile.firstName || "",
          lastName: userProfile.lastName || "",
          gender: userProfile.gender || "MALE",
          birthDate: userProfile?.birthDate
            ? format(userProfile.birthDate, "yyyy/MM/dd")
            : "",
          conditions: userProfile.conditions || "",
          allergies: userProfile.allergies || "",
          familyHistory: userProfile.familyHistory || "",
          socialHistory: userProfile.socialHistory || "",
          medications: userProfile.medications || "",
          surgeries: userProfile.surgeries || "",
          addictions: userProfile.addictions || "",
        },
  });

  const handleSubmit = useCallback(() => {
    console.log(form.values);
    // const validationResult = form.validate();

    // if (!validationResult.hasErrors) {
    const values = form.values;
    updateUserProfile({
      birthDate: parse(values.birthDate, "yyyy/MM/dd", new Date()),
      userId: userId,
      firstName: values.firstName ?? "",
      lastName: values.lastName ?? "",
      gender: values.gender ?? "MALE",
      allergies: values.allergies ?? "",
      conditions: values.conditions ?? "",
      familyHistory: values.familyHistory ?? "",
      medications: values.medications ?? "",
      surgeries: values.surgeries ?? "",
      socialHistory: values.socialHistory ?? "",
      addictions: values.addictions ?? "",
    });
  }, [form, userId]);
  return (
    <Stack>
      <SimpleGrid cols={2}>
        <TextInput
          label="نام"
          placeholder="نام"
          {...form.getInputProps("firstName")}
        />
        <TextInput
          label="نام خانوادگی"
          placeholder="نام خانوادگی"
          {...form.getInputProps("lastName")}
        />
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
        <Select
          label="جنسیت"
          placeholder="جنسیت"
          data={[
            {
              value: "MALE",
              label: "مرد",
            },
            {
              value: "FEMALE",
              label: "زن",
            },
          ]}
          {...form.getInputProps("gender")}
        />
      </SimpleGrid>
      <Textarea
        label="بیماری ها"
        placeholder="بیماری ها"
        {...form.getInputProps("conditions")}
      />
      <Textarea
        label="حساسیت ها"
        placeholder="حساسیت ها"
        {...form.getInputProps("allergies")}
      />
      <Textarea
        label="تاریخچه خانوادگی"
        placeholder="تاریخچه خانوادگی"
        {...form.getInputProps("familyHistory")}
      />
      <Textarea
        label="تاریخچه اجتماعی"
        placeholder="تاریخچه اجتماعی"
        {...form.getInputProps("socialHistory")}
      />
      <Textarea
        label="سابقه اعتیاد"
        placeholder="سابقه اعتیاد"
        {...form.getInputProps("addictions")}
      />
      <Textarea
        label="دارو های مصرفی"
        placeholder="دارو های مصرفی"
        {...form.getInputProps("medications")}
      />
      <Textarea
        label="سابقه عمل های جراحی"
        placeholder="سابقه عمل های جراحی"
        {...form.getInputProps("surgeries")}
      />
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
