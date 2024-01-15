"use server";

import { prisma } from "../db";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getAuthInfo } from "../utils/user";
import { sendSMS } from "../notification";

const AUTH_TOKEN = process.env.AUTH_TOKEN;

export const register = async (params: {
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  password: string;
}) => {
  let exists = await prisma.user.count({
    where: { phone: params.phone },
  });
  if (exists === 0)
    exists = await prisma.user.count({
      where: { nationalId: params.nationalId },
    });

  if (exists > 0)
    return {
      success: false,
      message: "User already registered",
    };

  const user = await prisma.user.create({
    data: {
      ...params,
      name: `${params.firstName} ${params.lastName}`,
      password: await hash(params.password),
    },
  });

  cookies().set(
    "auth",
    jwt.sign(
      {
        phone: user.phone,
        nationalId: user.nationalId,
        name: user.name,
      },
      AUTH_TOKEN,
    ),
  );

  return {
    success: true,
    data: user,
  };
};

export const revalidate = async () => {
  const user = await getAuthInfo();
  if (!user)
    return {
      success: false,
      message: "کاربری یافت نشد",
    };

  const _user = await prisma.user.findFirst({
    where: { nationalId: user.nationalId },
    select: {
      name: true,
      phone: true,
      nationalId: true,
    },
  });

  if (!_user)
    return {
      success: false,
      message: "کاربری یافت نشد",
    };

  cookies().set(
    "auth",
    jwt.sign(
      {
        phone: _user.phone,
        nationalId: _user.nationalId,
        name: _user.name,
      },
      AUTH_TOKEN,
    ),
  );

  return {
    success: true,
  };
};

export const requestLoginToken = async (nationalId: string) => {
  const user = await prisma.user.findFirst({
    where: { nationalId },
  });

  if (!user)
    return {
      success: false,
      message: "User not found",
    };

  // generate unique 8 digit token
  const token = Math.floor(10000000 + Math.random() * 90000000).toString();

  await prisma.loginToken.deleteMany({
    where: {
      user: {
        nationalId: user.nationalId,
      },
    },
  });

  await prisma.loginToken.create({
    data: {
      user: {
        connect: {
          nationalId: user.nationalId,
        },
      },
      token,
    },
  });

  console.log("token", token);
  console.log("phone", user.phone);

  sendSMS(`خدمات پرستاری سالکود.\n کد ورود شما: ${token}`, user.phone);

  return {
    success: true,
  };
};

export const loginWithToken = async (nationalId: string, token: string) => {
  const user = await prisma.user.findFirst({
    where: {
      nationalId,
      LoginToken: {
        some: {
          token,
        },
      },
    },
  });

  if (!user)
    return {
      success: false,
      message: "User not found",
    };

  cookies().set(
    "auth",
    jwt.sign(
      {
        phone: user.phone,
        nationalId: user.nationalId,
        name: user.name,
      },
      AUTH_TOKEN,
    ),
  );
  return {
    success: true,
    data: user,
  };
};

export const login = async (params: {
  nationalId: string;
  password: string;
}) => {
  const user = await prisma.user.findFirst({
    where: { nationalId: params.nationalId },
  });

  if (!user)
    return {
      success: false,
      message: "User not found",
    };

  if (!(await verify(user.password!, params.password)))
    return {
      success: false,
      message: "Invalid password",
    };

  cookies().set(
    "auth",
    jwt.sign(
      {
        phone: user.phone,
        nationalId: user.nationalId,
        name: user.name,
      },
      AUTH_TOKEN,
    ),
  );

  return {
    success: true,
    data: user,
  };
};

export const subscribe = async ({
  endpoint,
  auth,
  p256dh,
}: {
  endpoint: string;
  auth: string;
  p256dh: string;
}) => {
  const user = await getAuthInfo();

  if (!user)
    return {
      success: false,
      message: "User not found",
    };

  let subscription = await prisma.subscription.findFirst({
    where: { endpoint },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        endpoint,
        auth,
        p256dh,
        user: { connect: { nationalId: user.nationalId } },
      },
    });
  }

  return {
    success: true,
    data: subscription,
  };
};

export const logout = async ({ endpoint }: { endpoint?: string }) => {
  cookies().delete("auth");

  if (endpoint)
    await prisma.subscription.delete({
      where: { endpoint },
    });

  return {
    success: true,
    data: null,
  };
};
