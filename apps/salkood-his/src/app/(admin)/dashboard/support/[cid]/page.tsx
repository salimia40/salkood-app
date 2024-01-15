import React from "react";
import { prisma } from "@/bin/db";
import { Box, Stack } from "@mantine/core";
import { ConversationView } from "@/bin/components/ConversationView";
import { getUser } from "@/bin/utils/user";
import NewMessageForm from "@/bin/components/NewMessageForm";

export default async function Page({ params }: { params: { cid: string } }) {
  if (!params.cid) {
    return <div>Page</div>;
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: params.cid,
    },
    include: {
      messages: true,
    },
  });

  const userInfo = await getUser();

  if (!userInfo) {
    return <div>Page</div>;
  }

  if (!conversation) {
    return <div>Page</div>;
  }

  return (
    <Stack h="calc(100vh - 130px)" p="md">
      <Box style={{ flex: 1, overflowY: "auto" }}>
        <ConversationView
          conversation={{
            userId: userInfo?.nationalId || "",
            id: conversation?.id || "",
          }}
          height="100%"
        />
      </Box>
      <NewMessageForm conversationId={conversation.id} />
    </Stack>
  );
}
