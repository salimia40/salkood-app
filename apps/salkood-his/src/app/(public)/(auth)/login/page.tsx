"use client";

import {
  Paper,
  Title,
  Text,
  Container,
  Stack,
  Anchor,
  Box,
  Center,
} from "@mantine/core";
import LoginPasswordForm from "./LoginPasswordForm";
import React from "react";
import LoginOTP from "./LoginOTP";

export default function Page() {
  const [mode, setMode] = React.useState<"password" | "otp">("password");

  return (
    <Container size={460} py={40}>
      <Title ta="center">ورود به حساب کاربری</Title>
      <Text c="dimmed" fz="sm" ta="center">
        لطفا اطلاعات خود را وارد کنید
      </Text>

      <Paper
        withBorder
        shadow="md"
        p={30}
        radius="md"
        mt="xl"
        component={Stack}
        gap="md"
      >
        {mode === "password" ? <LoginPasswordForm /> : <LoginOTP />}
        <Anchor
          c="dimmed"
          size="sm"
          onClick={() =>
            mode === "password" ? setMode("otp") : setMode("password")
          }
        >
          <Center inline>
            <Box ml={5}>
              {mode === "password" ? "ورود با کد OTP" : "ورود با کلمه عبور"}
            </Box>
          </Center>
        </Anchor>
      </Paper>
    </Container>
  );
}
