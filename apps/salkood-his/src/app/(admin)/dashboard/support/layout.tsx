import { prisma } from "@/bin/db";
import {
  AppShellAside,
  AppShellMain,
  Stack,
  Image,
  Title,
  NavLink,
} from "@mantine/core";
import Link from "next/link";
import React from "react";

export default async function Layout(props: React.PropsWithChildren) {
  const conversations = await prisma.conversation.findMany({
    include: {
      messages: true,
      user: true,
    },
  });
  return (
    <>
      <AppShellMain>{props.children}</AppShellMain>
      <AppShellAside p="md">
        <Stack>
          {conversations.map((conversation) => (
            <NavLink
              key={conversation.id}
              label={conversation.subject}
              description={conversation.user.name}
              href={`/dashboard/support/${conversation.id}`}
              component={Link}
            />
          ))}
        </Stack>
        {conversations.length === 0 && (
          <Stack align="center" justify="center" h="100%" px="md">
            <Image src="/chat.svg" alt="empty" width={200} />
            <Title order={4} mt={"md"}>
              هیچ گفتگویی وجود ندارد
            </Title>
          </Stack>
        )}
      </AppShellAside>
    </>
  );
}
