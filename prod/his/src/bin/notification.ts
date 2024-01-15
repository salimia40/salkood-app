import { prisma } from "./db";
import { Notifications } from "notifications";

const notifications = Notifications.getInstance(
  prisma,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
  process.env.VAPID_SUBJECT,
  process.env.GCM_API_KEY,
  process.env.CHAT_HOST,
  process.env.CHAT_KEY,
  process.env.SMS_USERNAME,
  process.env.SMS_PASSWORD,
  process.env.SMS_SENDER,
);

export const broadcastMessage =
  notifications.broadcastMessage.bind(notifications);

export const sendSMS = notifications.sendSMS.bind(notifications);
