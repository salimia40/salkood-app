"use server";

import { cookies } from "next/headers";
import { prisma } from "../db";
import { verify } from "jsonwebtoken";
const AUTH_TOKEN = process.env.AUTH_TOKEN;

export const getAuthInfo = async () => {
  const token = cookies().get("auth")?.value;
  if (!token) return null;
  const info = (await verify(token, AUTH_TOKEN)) as unknown as {
    nationalId: string;
  };
  return info;
};

export const getUser = async () => {
  const info = await getAuthInfo();
  if (!info) return null;
  const user = await prisma.user.findFirst({
    where: { nationalId: info.nationalId },
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
