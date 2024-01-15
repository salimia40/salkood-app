import { AppShellMain, Code, Text } from "@mantine/core";
import React from "react";

import { prisma } from "db";
import { getUser } from "@/bin/utils/user";
import { Timeline } from "antd";
import { format } from "date-fns-jalali";
import { toPersianNumbers } from "@/bin/utils/text";

async function Page() {
  const user = await getUser();
  const appointments = await prisma.appointment.findMany({
    where: {
      staffId: user?.nationalId,
    },
    include: {
      user: true,
    },
  });

  return (
    <AppShellMain>
      {appointments.length > 0 && (
        <>
          <Timeline
            items={appointments
              .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
              .map((appointment, index) => ({
                children: (
                  <Text size="sm">
                    {toPersianNumbers(
                      format(appointment.dateTime, "MM/dd HH:mm"),
                    )}{" "}
                    به
                    <Code>{appointment.user.name}</Code>
                    مراجعه کنید
                  </Text>
                ),
                color: index === 0 ? "green" : "gray",
              }))}
          />
        </>
      )}
    </AppShellMain>
  );
}

export default Page;
