import {
  AppShellMain,
  Box,
  Text,
  Group,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import React from "react";
import { prisma } from "@/bin/db";
import { beatifyPhoneNumber, userRoleToPersian } from "@/bin/utils/text";
import { notFound } from "next/navigation";
import { IconMessageCircleShare, IconReceipt } from "@tabler/icons-react";
import Tabs from "./Tabs";
import { AppointmentDrawerAction } from "./[tab]/AppointmentDrawer";
import { NoteDrawerAction } from "./[tab]/NoteDrawer";
import Link from "next/link";
import ChangeRole from "./ChangeRole";
import ChargeInventory from "./ChargeInventory";

export default async function Page(props: {
  params: {
    userId: string;
  };
  children: React.ReactNode;
}) {
  const userId = props.params.userId;

  const user = await prisma.user.findUnique({
    where: {
      nationalId: userId,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <AppShellMain>
      <Box bg="gray.2" m={"-md"} p="md" style={{ flex: 1, overflowY: "auto" }}>
        <Group justify="space-between">
          <div>
            <Text>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text c="gray.7" size="xs">
              {userRoleToPersian(user?.role)}
            </Text>
          </div>
          <Group>
            <div>
              <Text c="gray.6" size="sm" ta={"end"}>
                {user?.nationalId}
              </Text>
              <Text
                c="gray.6"
                size="sm"
                component="a"
                href={`tel:${user?.phone}`}
                dir="ltr"
              >
                {beatifyPhoneNumber(user?.phone)}
              </Text>
            </div>
            <Tooltip label="ارسال پیام">
              <ActionIcon variant="subtle" color="gray.7">
                <IconMessageCircleShare size={"1.5rem"} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="ثبت فاکتور">
              <ActionIcon
                variant="subtle"
                color="gray.7"
                component={Link}
                href={`/dashboard/users/${userId}/newbill`}
              >
                <IconReceipt size={"1.5rem"} />
              </ActionIcon>
            </Tooltip>
            <ChargeInventory userId={userId} />
            <NoteDrawerAction userId={userId} />
            <AppointmentDrawerAction userId={userId} />
            <ChangeRole userId={userId} role={user?.role} />
          </Group>
        </Group>
      </Box>
      <Tabs userId={userId} />
      <Box m={"md"}>{props.children}</Box>
    </AppShellMain>
  );
}
