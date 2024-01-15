"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";
import { Good } from "db";

type GoodType = Pick<
  Good,
  "id" | "name" | "description" | "price" | "quantity" | "staffPrice"
>;

type GoodInput = Omit<GoodType, "id">;

export const createGood = async (data: GoodInput) => {
  await prisma.good.create({
    data,
  });
  revalidatePath("/dashboard/goods");

  return {
    success: true,
    message: "محصول با موفقیت اضافه شد",
  };
};

export const updateGood = async ({ id, ...data }: GoodType) => {
  await prisma.good.update({
    where: {
      id,
    },
    data,
  });
  revalidatePath("/dashboard/goods");
  return {
    success: true,
    message: "محصول با موفقیت ویرایش شد",
  };
};

export const deleteGood = async (id: string) => {
  await prisma.good.delete({
    where: {
      id,
    },
  });
  revalidatePath("/dashboard/goods");
  return {
    success: true,
    message: "محصول با موفقیت حذف شد",
  };
};

export const searchGood = async (query: string) => {
  const goods = await prisma.good.findMany({
    where: {
      name: {
        contains: query,
      },
    },
  });
  return goods;
};

export const getGood = async (id: string) => {
  if (!id) return null;
  if (typeof id !== "string") return null;
  if (id.length === 0) return null;
  const good = await prisma.good.findUnique({
    where: {
      id,
    },
  });
  return good;
};
