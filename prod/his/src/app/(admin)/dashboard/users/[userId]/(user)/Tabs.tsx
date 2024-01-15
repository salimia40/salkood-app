"use client";
import { TabsList, TabsTab, Tabs } from "@mantine/core";
import {
  IconUser,
  IconCalendarClock,
  IconCash,
  IconReceipt,
  IconNote,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function _Tabs({ userId }: { userId: string }) {
  const router = useRouter();
  const params = useParams();

  const activeTab = (params.tab as string) || "profile";

  return (
    <Tabs
      bg={"gray.2"}
      m={"-md"}
      p="md"
      pb={0}
      value={activeTab}
      onChange={(tab) => {
        if (tab === "profile") return router.push(`/dashboard/users/${userId}`);
        router.push(`/dashboard/users/${userId}/${tab}`);
      }}
    >
      <TabsList style={{ flex: 1, overflowY: "auto" }} px={"50"}>
        <TabsTab value="profile" leftSection={<IconUser size={"0.8rem"} />}>
          پروفایل
        </TabsTab>
        <TabsTab
          value="appointments"
          leftSection={<IconCalendarClock size={"0.8rem"} />}
        >
          نوبت ها
        </TabsTab>
        <TabsTab value="payments" leftSection={<IconCash size={"0.8rem"} />}>
          پرداخت ها
        </TabsTab>
        <TabsTab value="bills" leftSection={<IconReceipt size={"0.8rem"} />}>
          صورت حساب ها
        </TabsTab>
        <TabsTab value="notes" leftSection={<IconNote size={"0.8rem"} />}>
          یادداشت ها
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
