"use server";

import { AppointmentStatus } from "db";
import { prisma } from "db";
import { revalidatePath } from "next/cache";

export const createAppointment = async (data: {
  userId: string;
  staffId: string;
  date: Date;
  durationMinutes: number;
  note: string;
  status: AppointmentStatus;
}) => {
  await prisma.appointment.create({
    data: {
      userId: data.userId,
      staffId: data.staffId,
      dateTime: data.date,
      status: data.status,
      durationMinutes: data.durationMinutes,
      note: data.note,
    },
  });

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard/users/[userId]/appointments");

  return {
    success: true,
    message: "با موفقیت ثبت شد",
  };
};

export const updateAppointment = async (data: {
  id: number;
  date: Date;
  staffId: string;
  durationMinutes: number;
  note: string;
  status: AppointmentStatus;
}) => {
  await prisma.appointment.update({
    where: {
      id: data.id,
    },
    data: {
      dateTime: data.date,
      staffId: data.staffId,
      durationMinutes: data.durationMinutes,
      note: data.note,
      status: data.status,
    },
  });

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard/users/[userId]/appointments");

  return {
    success: true,
    message: "با موفقیت بروزرسانی شد",
  };
};
