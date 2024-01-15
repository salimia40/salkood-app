"use client";

import { createConversation } from "@/bin/actions/conversation";
import { Stack, Title, TextInput, ActionIcon } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { getHotkeyHandler } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import React from "react";
import { z } from "zod";

export default function ConversationForm({
  onNewConversation,
}: {
  onNewConversation?: (conversationId: string) => void;
}) {
  const form = useForm({
    initialValues: {
      subject: "",
      message: "",
    },
    validate: zodResolver(
      z.object({
        subject: z.string().min(1),
        message: z.string().min(1),
      }),
    ),
  });
  const handleSubmit = async () => {
    const validationRes = form.validate();
    if (validationRes.hasErrors) return;
    const result = await createConversation(form.values);
    if (result.success) {
      form.reset();
      notifications.show({
        title: "موفق",
        message: "گفتگو با موفقیت ارسال شد",
        color: "green",
      });
      if (onNewConversation && result.data) onNewConversation(result.data.id);
    } else {
      notifications.show({
        title: "خطا",
        message: result.message,
        color: "red",
      });
    }
  };

  return (
    <Stack>
      <Title order={3}> گفتگو جدید</Title>
      <TextInput placeholder="موضوع گفتگو" {...form.getInputProps("subject")} />
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
    </Stack>
  );
}
