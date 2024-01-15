import { prisma } from "@/bin/db";
import { Stack, Image, Title } from "@mantine/core";
import React from "react";

export default async function Page() {
  const conversations = await prisma.conversation.count({});
  return (
    <Stack align="center" justify="center" h="100%" px="md" mt={"100px"}>
      <Image
        src={conversations === 0 ? "/chat.svg" : "/support.svg"}
        alt="empty"
        w={300}
        h={300}
      />
      <Title order={4} mt={"md"}>
        {conversations === 0
          ? "هیچ گفتگویی وجود ندارد"
          : "برای شروع گفتگو ابتدا یک گفتگو انتخاب کنید"}
      </Title>
    </Stack>
  );
}
