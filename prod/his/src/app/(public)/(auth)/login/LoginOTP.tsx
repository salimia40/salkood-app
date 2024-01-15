"use client";

import { loginWithToken, requestLoginToken } from "@/bin/actions/auth";
import {
  Anchor,
  Box,
  Button,
  Center,
  Group,
  Input,
  PinInput,
  Stack,
  TextInput,
  Text,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { notifications } from "@mantine/notifications";

function LoginOTP() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm({
    initialValues: {
      nationalId: "",
      otp: "",
    },
  });

  const handleSubmit = useCallback(async () => {
    setPending(true);
    const validationRes = form.validate();
    if (validationRes.hasErrors) return setPending(false);
    const { nationalId, otp } = form.values;
    const authResult = await loginWithToken(nationalId, otp);
    if (authResult.success) return router.replace("/");
    form.setFieldError("otp", authResult.message);
    setPending(false);
  }, [form, router]);

  return (
    <Stack>
      <TextInput
        label="کد ملی"
        required
        {...form.getInputProps("nationalId")}
      />
      <Input.Wrapper
        label="کد OTP"
        description="کد OTP ارسال شده به شماره تلفن همراه خود را وارد کنید"
        required
        error={form.errors.otp}
        withAsterisk
      >
        <PinInput
          oneTimeCode
          {...form.getInputProps("otp")}
          length={8}
          style={{
            direction: "ltr",
            justifyContent: "center",
          }}
        />
      </Input.Wrapper>

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

      <Box mt="xl">
        <Text c="dimmed" ta="center">
          اگر هنوز کد OTP دریافت نکرده اید؟{" "}
          <Anchor
            c="dimmed"
            size="sm"
            onClick={async () => {
              await requestLoginToken(form.values.nationalId);
              notifications.show({
                title: "کد جدید",
                message: "کد جدید برای شما ارسال شد",
                color: "green",
              });
            }}
          >
            درخواست کد جدید
          </Anchor>
        </Text>
      </Box>
    </Stack>
  );
}

export default LoginOTP;
