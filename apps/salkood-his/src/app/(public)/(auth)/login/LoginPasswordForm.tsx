"use client";
import { login } from "@/bin/actions/auth";
import {
  Stack,
  TextInput,
  Group,
  Anchor,
  Center,
  rem,
  Box,
  Button,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { z } from "zod";

function LoginPasswordForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm({
    initialValues: {
      nationalId: "",
      password: "",
    },
    validate: zodResolver(
      z.object({
        nationalId: z.string().length(10),
        password: z.string().min(8).max(36),
      }),
    ),
  });

  const handleSubmit = useCallback(async () => {
    setPending(true);
    const validationRes = form.validate();
    console.log(validationRes);
    if (validationRes.hasErrors) return setPending(false);
    const { nationalId, password } = form.values;
    const authResult = await login({ nationalId, password });
    if (authResult.success) return router.replace("/");
    form.setFieldError("password", authResult.message);
    setPending(false);
    notifications.show({
      title: "خطا",
      message: authResult.message,
      color: "red",
    });
  }, [form, router]);

  return (
    <Stack gap="md">
      <TextInput
        label="کد ملی"
        required
        {...form.getInputProps("nationalId")}
      />
      <TextInput
        label="رمز عبور"
        placeholder="********"
        required
        description={
          <Text component={Link} href="/login/reset" size="xs">
            رمز عبور خود را فراموش کرده اید؟
          </Text>
        }
        {...form.getInputProps("password")}
      />
      <Group justify="space-between" mt="lg">
        <Anchor c="dimmed" size="sm" component={Link} href="/register">
          <Center inline>
            <IconArrowRight
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
            <Box ml={5}>عضو نیستید؟ ثبت نام کنید</Box>
          </Center>
        </Anchor>
        <Button disabled={pending} onClick={handleSubmit}>
          ورود
        </Button>
      </Group>
    </Stack>
  );
}

export default LoginPasswordForm;
