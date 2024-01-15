"use server";
import { prisma } from "db";
import { getUser } from "../utils/user";
import { revalidatePath } from "next/cache";

export const createNote = async (data: {
  userId: string;
  content: string;
  appointmentId?: number;
}) => {
  const userInfo = await getUser();
  if (!userInfo) {
    return {
      success: false,
      message: "کاربر یافت نشد",
    };
  }
  await prisma.note.create({
    data: {
      authorId: userInfo.nationalId,
      ...data,
    },
  });

  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard/users/[userId]/notes");
};

export const updateNote = async (data: {
  id: number;
  content: string;
  appointmentId?: number;
}) => {
  const userInfo = await getUser();
  if (!userInfo) {
    return {
      success: false,
      message: "کاربر یافت نشد",
    };
  }
  await prisma.note.update({
    where: {
      id: data.id,
    },
    data: {
      authorId: userInfo.nationalId,
      ...data,
    },
  });

  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard/users/[userId]/notes");

  return {
    success: true,
    message: "با موفقیت بروزرسانی شد",
  };
};

export const deleteNote = async (id: number) => {
  await prisma.note.delete({
    where: {
      id,
    },
  });
  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard/users/[userId]/notes");
  return {
    success: true,
    message: "با موفقیت حذف شد",
  };
};
