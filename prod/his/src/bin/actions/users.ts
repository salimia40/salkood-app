"use server";

import { prisma } from "../db";
import { getAuthInfo } from "../utils/user";
import { revalidatePath } from "next/cache";
import { Prisma, StaffProfile, UserRole } from "db";

export const updateUserProfile = async ({
  userId,
  ...params
}: {
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  //   nationalId: string
  gender: "MALE" | "FEMALE";
  conditions: string;
  allergies: string;
  medications: string;
  surgeries: string;
  familyHistory: string;
  socialHistory: string;
  addictions: string;
}) => {
  await prisma.userProfile.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      ...params,
    },
    update: {
      ...params,
    },
  });

  await prisma.user.update({
    where: {
      nationalId: userId,
    },
    data: {
      name: `${params.firstName} ${params.lastName}`,
      firstName: params.firstName,
      lastName: params.lastName,
    },
  });

  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath(`/dashboard/users`);
};

export const changeUserRole = async ({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}) => {
  await prisma.user.update({
    where: {
      nationalId: userId,
    },
    data: {
      role,
    },
  });
  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath(`/dashboard/users`);
};

type StaffProfileInput = Pick<
  StaffProfile,
  "firstName" | "lastName" | "birthDate" | "gender" | "title" | "userId"
>;

export const updateStaffProfile = async ({
  userId,
  ...params
}: StaffProfileInput) => {
  await prisma.staffProfile.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      ...params,
    },
    update: {
      ...params,
    },
  });

  await prisma.user.update({
    where: {
      nationalId: userId,
    },
    data: {
      name: `${params.firstName} ${params.lastName}`,
      firstName: params.firstName,
      lastName: params.lastName,
    },
  });

  revalidatePath(`/dashboard/staff/${userId}`);
  revalidatePath(`/dashboard/staff`);
  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath(`/dashboard/users`);
};

export const searchUser = async ({
  query,
  role,
}: {
  query: string;
  role: UserRole | UserRole[] | undefined;
}) => {
  const where: Prisma.UserWhereInput = {};

  if (role) {
    if (Array.isArray(role))
      where.role = {
        in: role,
      };
    else where.role = role;
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          nationalId: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
      ...where,
    },
  });
  return users;
};

export const getUser = async (nationalId: string) => {
  const info = await getAuthInfo();
  if (!info) return null;
  const user = await prisma.user.findFirst({
    where: { nationalId },
    select: {
      name: true,
      phone: true,
      nationalId: true,
      createdAt: true,
      role: true,
    },
  });
  return user;
};

export const createNewUser = async (data: Prisma.UserCreateInput) => {
  const user = await prisma.user.findUnique({
    where: {
      nationalId: data.nationalId,
    },
  });
  if (user)
    return {
      success: false,
      message: "کاربری با این شماره ملی وجود دارد",
    };

  const phone = await prisma.user.findUnique({
    where: {
      phone: data.phone,
    },
  });
  if (phone)
    return {
      success: false,
      message: "کاربری با این شماره تلفن وجود دارد",
    };

  await prisma.user.create({
    data: {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
    },
  });

  revalidatePath("/dashboard/users");

  return {
    success: true,
    message: "کاربر با موفقیت ایجاد شد",
  };
};
