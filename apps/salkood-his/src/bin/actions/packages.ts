"use server";

import { prisma } from "db";
import { revalidatePath } from "next/cache";

type FormValues = {
  name: string;
  description: string;
  packageItems: {
    goodId: string;
    quantity: number;
  }[];
};

export const createPackage = async (data: FormValues) => {
  await prisma.package.create({
    data: {
      name: data.name,
      description: data.description,
      packageItems: {
        create: data.packageItems.map((item) => ({
          good: {
            connect: {
              id: item.goodId,
            },
          },
          quantity: item.quantity,
        })),
      },
    },
  });

  revalidatePath("/dashboard/packages");
  return {
    success: true,
    message: "با موفقیت ایجاد شد",
  };
};

export const updatePackage = async (data: FormValues & { id: string }) => {
  await prisma.package.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      description: data.description,
      packageItems: {
        deleteMany: {},
        create: data.packageItems.map((item) => ({
          good: {
            connect: {
              id: item.goodId,
            },
          },
          quantity: item.quantity,
        })),
      },
    },
  });

  revalidatePath("/dashboard/packages");
  return {
    success: true,
    message: "با موفقیت بروزرسانی شد",
  };
};

export const deletePackage = async (id: string) => {
  await prisma.package.delete({
    where: {
      id,
    },
  });
  revalidatePath("/dashboard/packages");
  return {
    success: true,
    message: "با موفقیت حذف شد",
  };
};

export const searchPackages = async (query: string) => {
  return await prisma.package.findMany({
    where: {
      name: {
        contains: query,
      },
    },
  });
};

export const getPackage = async (id: string) => {
  return await prisma.package.findUnique({
    where: {
      id,
    },
  });
};
