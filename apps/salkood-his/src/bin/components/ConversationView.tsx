"use client";
import { Stack, Text } from "@mantine/core";
import { format } from "date-fns-jalali";
import { useAtomValue } from "jotai";
import { useRef, useEffect } from "react";
import { messagesAtoms } from "../atoms/messages";

export const ConversationView = ({
  conversation,
  height = "calc(100vh - 130px)",
}: {
  conversation: {
    id: string;
    userId: string;
  };
  height: string;
}) => {
  const viewport = useRef<HTMLDivElement>(null);
  const data = useAtomValue(messagesAtoms);

  useEffect(() => {
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: "smooth",
    });
  }, [data]);

  return (
    <Stack
      ref={viewport}
      style={{
        overflowY: "auto",
      }}
      h={height}
    >
      {data
        .filter((message) => message.conversationId === conversation.id)
        .sort(
          (b, a) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((message) => (
          <Text
            key={message.id}
            size="xs"
            c={message.userId === conversation.userId ? "blue" : "gray.7"}
            fw={700}
            ta={message.userId === conversation.userId ? "right" : "left"}
          >
            {message.content}
            <Text
              size="xs"
              c="dimmed"
              ta={message.userId === conversation.userId ? "right" : "left"}
            >
              {format(new Date(message.createdAt), "yyyy/mm/dd HH:mm")}
            </Text>
          </Text>
        ))}
    </Stack>
  );
};
