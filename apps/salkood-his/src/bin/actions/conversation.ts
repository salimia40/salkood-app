"use server";

import { prisma } from "../db";
import { getUser } from "../utils/user";
import { revalidatePath } from "next/cache";
import { broadcastMessage } from "../notification";

export const createConversation = async ({
  subject,
  message,
}: {
  subject: string;
  message: string;
}) => {
  const userInfo = await getUser();
  const userId = userInfo?.nationalId;

  if (!userId) {
    return {
      success: false,
      message: "کاربر یافت نشد",
    };
  }

  const conversation = await prisma.conversation.create({
    data: {
      subject: subject,
      userId,
      status: "OPEN",
      messages: {
        create: {
          userId,
          content: message,
          seen: false,
        },
      },
    },
    include: {
      messages: true,
    },
  });

  broadcastMessage(conversation.messages[0]);

  revalidatePath("/support");
  return {
    success: true,
    data: conversation,
    message: "گفتگو با موفقیت ایجاد شد",
  };
};

export const sendMessage = async ({
  conversationId,
  message,
}: {
  conversationId: string;
  message: string;
}) => {
  const userInfo = await getUser();
  const userId = userInfo?.nationalId;

  if (!userId) {
    return {
      success: false,
      message: "کاربر یافت نشد",
    };
  }
  const _message = await prisma.message.create({
    data: {
      userId,
      conversationId,
      content: message,
      seen: false,
    },
  });

  broadcastMessage(_message);

  return {
    success: true,
    data: _message,
    message: "پیام با موفقیت ارسال شد",
  };
};

export const closeConversation = async ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const userInfo = await getUser();
  const userId = userInfo?.nationalId;

  if (!userId) {
    return {
      success: false,
      message: "کاربر یافت نشد",
    };
  }

  const conversation = await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      status: "CLOSED",
    },
  });

  revalidatePath("/support");

  return {
    success: true,
    data: conversation,
    message: "گفتگو با موفقیت بسته شد",
  };
};

export const getConversations = async () => {
  const userInfo = await getUser();
  const userId = userInfo?.nationalId;

  if (!userId) {
    return {
      success: false,
      message: "کاربر یافت نشد",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      nationalId: userId,
    },
    select: {
      role: true,
    },
  });

  if (user && ["ADMIN", "SUPPORT"].includes(user.role)) {
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: true,
      },
    });
    return {
      success: true,
      data: conversations,
    };
  }
  const conversations = await prisma.conversation.findMany({
    where: {
      userId,
    },
    include: {
      messages: true,
    },
  });

  return {
    success: true,
    data: conversations,
  };
};
