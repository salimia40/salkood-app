"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";

import { Service } from "db";

export const createService = async ({
  name,
  description,
  price,
}: {
  name: string;
  description: string;
  price: number;
}) => {
  await prisma.service.create({
    data: {
      name,
      description,
      price,
    },
  });
  revalidatePath("/dashboard/goods");

  return {
    success: true,
    message: "محصول با موفقیت اضافه شد",
  };
};

export const updateService = async ({
  id,
  ...service
}: Pick<
  Service,
  "id" | "name" | "price" | "description" | "enabled" | "type"
>) => {
  await prisma.service.update({
    where: {
      id,
    },
    data: service,
  });
  revalidatePath("/dashboard/goods");
  return {
    success: true,
    message: "محصول با موفقیت ویرایش شد",
  };
};

export const deleteService = async (id: string) => {
  await prisma.service.delete({
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

export const searchService = async (query: string) => {
  const services = await prisma.service.findMany({
    where: {
      name: {
        contains: query,
      },
    },
  });
  return services;
};

export const getService = async (id: string) => {
  if (!id) return null;
  if (typeof id !== "string") return null;
  if (id.length === 0) return null;
  const service = await prisma.service.findUnique({
    where: {
      id,
    },
  });
  return service;
};
