"use client";
import { sendMessage } from "@/bin/actions/conversation";
import { TextInput, ActionIcon } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { getHotkeyHandler } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import React from "react";
import { z } from "zod";

export default function NewMessageForm({
  conversationId,
}: {
  conversationId: string;
}) {
  const form = useForm({
    initialValues: {
      message: "",
    },
    validate: zodResolver(
      z.object({
        message: z.string().min(1),
      }),
    ),
  });

  const handleSubmit = async () => {
    const validationRes = form.validate();
    if (validationRes.hasErrors) return;
    const result = await sendMessage({
      conversationId,
      message: form.values.message,
    });

    if (result.success) {
      form.reset();
    } else {
      notifications.show({
        title: "خطا",
        message: result.message,
        color: "red",
      });
    }
  };

  return (
    <TextInput
      {...form.getInputProps("message")}
      placeholder="متن گفتگو"
      onKeyDown={getHotkeyHandler([["Enter", handleSubmit]])}
      inputMode="search"
      rightSection={
        <ActionIcon variant="subtle">
          <IconSend
            style={{
              transform: "rotate(225deg)",
            }}
            size={20}
          />
        </ActionIcon>
      }
    />
  );
}
