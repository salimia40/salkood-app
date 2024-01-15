"use client";
import { register } from "@/bin/actions/auth";
import {
  TextInput,
  Group,
  Anchor,
  Center,
  rem,
  Box,
  Button,
  Stack,
  PasswordInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { z } from "zod";

function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      nationalId: "",
      phone: "",
      password: "",
      repeatPassword: "",
    },
    validate: zodResolver(
      z
        .object({
          firstName: z.string().min(2).max(50),
          lastName: z.string().min(2).max(50),
          nationalId: z.string(),
          phone: z.string().length(11),
          password: z.string().min(8).max(36),
          repeatPassword: z.string().min(8).max(36),
        })
        .refine((data) => data.password === data.repeatPassword, {
          message: "Passwords do not match",
          path: ["repeatPassword"],
        }),
    ),
  });

  const handleSubmit = useCallback(async () => {
    setPending(true);
    const validationRes = form.validate();
    if (validationRes.hasErrors) return setPending(false);
    const { /* repeatPassword, */ ...values } = form.values; // Remove 'repeatPassword' from the destructuring statement
    const authResult = await register(values);
    if (authResult.success) {
      return router.replace("/");
    }
    form.setFieldError("phone", authResult.message);
    setPending(false);
  }, [form, router]);

  return (
    <Stack>
      <TextInput
        label="Your First Name"
        required
        {...form.getInputProps("firstName")}
      />
      <TextInput
        label="Your Last Name"
        required
        {...form.getInputProps("lastName")}
      />
      <TextInput
        label="Your National Id"
        required
        {...form.getInputProps("nationalId")}
      />
      <TextInput label="Your phone" required {...form.getInputProps("phone")} />
      <PasswordInput
        label="Your password"
        required
        {...form.getInputProps("password")}
      />
      <PasswordInput
        label="repeat your password"
        required
        {...form.getInputProps("repeatPassword")}
      />
      <Group justify="space-between" mt="lg">
        <Anchor component={Link} href="/login" c="dimmed" size="sm">
          <Center inline>
            <IconArrowRight
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
            <Box ml={5}>Already have an eccount? Login!</Box>
          </Center>
        </Anchor>
        <Button onClick={handleSubmit} disabled={pending}>
          Register
        </Button>
      </Group>
    </Stack>
  );
}

export default RegisterForm;
