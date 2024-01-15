import { sign } from "jsonwebtoken";
import React from "react";
import { getUser } from "../../utils/user";
import Socketio from "../Socketio";
import { prisma } from "../../db";
import { headers } from "next/headers";
import ChatWidget from "./ChatWidget";
import InstallPWA from "./InstallPWA";

export default async function ChatClient() {
  const userInfo = await getUser();
  if (!userInfo) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      nationalId: userInfo.nationalId,
    },
    select: {
      role: true,
    },
  });

  const pathname = headers().get("x-pathname");

  return (
    <>
      <Socketio
        host={process.env.CHAT_HOST}
        token={sign(userInfo.nationalId, process.env.CHAT_SECRET!)}
      />
      {user?.role !== "ADMIN" && !pathname?.startsWith("/support") && (
        <ChatWidget />
      )}
      <InstallPWA loggedIn={user !== null} />
    </>
  );
}
