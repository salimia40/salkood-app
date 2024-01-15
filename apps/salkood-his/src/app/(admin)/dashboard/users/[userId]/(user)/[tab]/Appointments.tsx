import React from "react";
import { prisma } from "@/bin/db";
import {
  Stack,
  Title,
  Table,
  TableThead,
  TableTbody,
  TableTr,
  TableTh,
  TableTd,
  Group,
} from "@mantine/core";
import AppointmentDrawerButton, {
  EditAppointmentDrawer,
} from "./AppointmentDrawer";
import { format } from "date-fns-jalali";
import { appointmentStatusToPersian, toPersianNumbers } from "@/bin/utils/text";
import Pagination from "@/bin/components/pagination";

export default async function Appointments({
  userId,
  page,
}: {
  userId: string;
  page?: number;
}) {
  const appointments = await prisma.appointment.findMany({
    where: {
      userId: userId,
    },
    take: 10,
    skip: page ? (page - 1) * 10 : 0,
    include: {
      staff: true,
    },
  });

  const total = await prisma.appointment.count({
    where: {
      userId: userId,
    },
  });

  if (appointments.length === 0)
    return (
      <Stack align="center" mt="xl">
        <Title order={3}>ویزیتی وجود ندارد</Title>
        <AppointmentDrawerButton userId={userId} />
      </Stack>
    );

  return (
    <Stack mt="xl">
      <Group justify="space-between">
        <Title order={3}>ویزیت ها</Title>
        <Pagination total={Math.ceil(total / 10)} />
      </Group>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh> شناسه </TableTh>
            <TableTh> تاریخ و ساعت </TableTh>
            <TableTh> کارشناس </TableTh>
            <TableTh> مدت زمان </TableTh>
            <TableTh> وضعیت </TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {appointments.map((appointment) => (
            <TableTr key={appointment.id}>
              <TableTd>
                <EditAppointmentDrawer appointment={appointment} />
                {appointment.id}
              </TableTd>
              <TableTd>
                {toPersianNumbers(
                  format(appointment.dateTime, "yyyy/MM/dd HH:mm"),
                )}
              </TableTd>
              <TableTd>{appointment.staff.name}</TableTd>
              <TableTd>
                {toPersianNumbers(appointment.durationMinutes || 0)} دقیقه
              </TableTd>
              <TableTd>
                {appointmentStatusToPersian(appointment.status)}
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </Stack>
  );
}
