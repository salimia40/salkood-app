"use server";

import { BillItemType } from "db";

import { prisma } from "db";
import { revalidatePath } from "next/cache";
import { getUser } from "../utils/user";

export const createBill = async ({
  userId,
  items,
}: {
  userId: string;
  items: {
    value: string;
    quantity: number;
    type: BillItemType;
  }[];
}) => {
  const staff = await getUser();

  if (!staff) {
    return {
      success: false,
      message: "کاربر یافت نشد",
    };
  }

  let amountDue = 0;
  let staffCharge = 0;
  const billItems = [];

  for (const item of items) {
    let pricePerUnit = 0;
    if (item.type === "GOOD") {
      pricePerUnit =
        (await prisma.good.findUnique({ where: { id: item.value } }))?.price ||
        0;

      await prisma.inventory.upsert({
        where: {
          goodId_userId: {
            goodId: item.value,
            userId: staff.nationalId,
          },
        },
        update: {
          quantity: {
            decrement: item.quantity,
          },
        },
        create: {
          goodId: item.value,
          userId: staff.nationalId,
          quantity: -item.quantity,
        },
      });

      staffCharge += pricePerUnit * item.quantity;

      billItems.push({
        goodId: item.value,
        type: item.type,
        quantity: item.quantity,
        pricePerUnit,
        totalPrice: pricePerUnit * item.quantity,
      });
    } else if (item.type === "SERVICE") {
      pricePerUnit =
        (await prisma.good.findUnique({ where: { id: item.value } }))?.price ||
        0;
      billItems.push({
        serviceId: item.value,
        type: item.type,
        quantity: item.quantity,
        pricePerUnit,
        totalPrice: pricePerUnit * item.quantity,
      });
    } else {
      pricePerUnit = item.quantity;
      billItems.push({
        label: item.value,
        type: item.type,
        pricePerUnit: item.quantity,
        totalPrice: item.quantity,
      });

      staffCharge += pricePerUnit * 0.8;
    }
    if (item.type !== "ADDITIONAL") {
      amountDue += pricePerUnit * item.quantity;
    } else {
      staffCharge += pricePerUnit;
      amountDue += pricePerUnit;
    }
  }

  const tax = 0.09 * amountDue;
  const maintenanceFee = 0.01 * amountDue + 10_000;

  amountDue += tax + maintenanceFee;

  await prisma.bill.create({
    data: {
      userId,
      amountDue,
      staffCharge,
      staffId: staff.nationalId,
      paidAmount: 0,
      paymentMethod: "BANK_TRANSFER",
      tax,
      maintenanceFee,
      billItems: {
        createMany: {
          data: billItems,
        },
      },
    },
  });

  revalidatePath("/dashboard/bills");
  revalidatePath(`/dashboard/users/${userId}/bills`);
};
