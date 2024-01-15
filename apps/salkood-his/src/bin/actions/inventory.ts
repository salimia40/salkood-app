"use server";

import { prisma } from "db";

export const chargeInventory = async (data: {
  userId: string;
  packageId: string;
}) => {
  const _package = await prisma.package.findUnique({
    where: {
      id: data.packageId,
    },
    include: {
      packageItems: {
        include: {
          good: true,
        },
      },
    },
  });

  let total = 0;

  if (!_package) {
    return {
      success: false,
      message: "بسته انتخاب شده یافت نشد",
    };
  }

  for (const item of _package.packageItems) {
    total += item.good.staffPrice ?? item.good.price * item.quantity;

    await prisma.inventory.upsert({
      where: {
        goodId_userId: {
          goodId: item.goodId,
          userId: data.userId,
        },
      },
      create: {
        goodId: item.goodId,
        userId: data.userId,
        quantity: item.quantity,
      },
      update: {
        quantity: {
          increment: item.quantity,
        },
      },
    });

    await prisma.good.update({
      where: {
        id: item.goodId,
      },
      data: {
        quantity: {
          decrement: item.quantity,
        },
      },
    });
  }

  await prisma.user.update({
    where: {
      nationalId: data.userId,
    },
    data: {
      charge: {
        decrement: total,
      },
    },
  });

  return {
    success: true,
    message: "با موفقیت اضافه شد",
  };
};
