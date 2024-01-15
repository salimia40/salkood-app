import webPush from "web-push";
import axios from "axios";
import type { PrismaClient, Message } from "db";
import SMS from "./sms";

/**
 * The Notifications class.
 * @class Notifications
 * @needs PrismaClient
 * This class is responsible for handling notifications in the application. Here's a summary of each class method:
 * getInstance: This static method returns the instance of the Notifications class. It ensures that only one instance of the class is created.
 * constructor: This is the constructor function for the class. It initializes the private variables and sets up the necessary configurations for sending notifications.
 * broadcastMessage: This method is responsible for broadcasting a message to the relevant users. It retrieves the conversation associated with the message, sends the message to the chat server, and sends the message to support users.
 * sendToChatServer: This private method sends the message to the chat server. It checks if the user is online, and if not, sends a push notification using the Web Push API. If the user is online, it sends the message directly to the chat server using an HTTP POST request.
 */
export class Notifications {
  private static instance: Notifications;
  private sms: SMS;

  public static getInstance(
    prisma: PrismaClient,
    VapidPublicKey: string,
    VapidPrivateKey: string,
    VapidSubject: string,
    GCMAPIKey: string,
    chatHost: string,
    chatKey: string,
    SMSusername: string,
    SMSpassword: string,
    SMSsender: string,
  ) {
    if (!Notifications.instance) {
      Notifications.instance = new Notifications(
        prisma,
        VapidPublicKey,
        VapidPrivateKey,
        VapidSubject,
        GCMAPIKey,
        chatHost,
        chatKey,
        SMSusername,
        SMSpassword,
        SMSsender,
      );
    }
    return Notifications.instance;
  }

  /**
   * Constructor function for the class.
   *
   * @param {PrismaClient} prisma - The Prisma client.
   * @param {string} VapidPublicKey - The Vapid public key.
   * @param {string} VapidPrivateKey - The Vapid private key.
   * @param {string} VapidSubject - The Vapid subject.
   * @param {string} GCMAPIKey - The GCM API key.
   * @param {string} chatHost - The chat host.
   * @param {string} chatKey - The chat key.
   */
  constructor(
    private readonly prisma: PrismaClient,
    VapidPublicKey: string,
    VapidPrivateKey: string,
    VapidSubject: string,
    GCMAPIKey: string,
    private readonly chatHost: string,
    private readonly chatKey: string,
    SMSusername: string,
    SMSpassword: string,
    private readonly SMSsender: string,
  ) {
    webPush.setGCMAPIKey(GCMAPIKey);
    webPush.setVapidDetails(VapidSubject, VapidPublicKey, VapidPrivateKey);
    this.sms = new SMS(SMSusername, SMSpassword);
  }

  /**
   * Broadcasts a message to the chat server.
   *
   * @param {Message} message - The message to be broadcasted.
   * @return {void} This function does not return anything.
   */
  public async broadcastMessage(message: Message) {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: message.conversationId,
      },
    });

    if (!conversation) {
      return;
    }
    this.sendToChatServer(conversation.userId, message);

    const supportUsers = await this.prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "SUPPORT"],
        },
      },
      select: {
        nationalId: true,
      },
    });

    for (const { nationalId } of supportUsers) {
      this.sendToChatServer(nationalId, message);
    }
  }
  private async sendToChatServer(userId: string, message: object) {
    const isUserOnline = await this.prisma.user.findUnique({
      where: {
        nationalId: userId,
      },
      include: {
        onlineStatus: {
          select: {
            online: true,
          },
        },
      },
    });

    if (!isUserOnline?.onlineStatus?.online) {
      const subscribtions = await this.prisma.subscription.findMany({
        where: {
          user: {
            nationalId: userId,
          },
        },
      });

      subscribtions.forEach((sub) => {
        webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.auth,
              p256dh: sub.p256dh,
            },
          },
          JSON.stringify({ title: "پیام جدید", body: message }),
          {
            TTL: 60,
          },
        );
      });
    } else {
      axios.post(`http://${this.chatHost}/api/users/${userId}`, message, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "master-key": this.chatKey,
        },
      });
    }
  }

  public async sendSMS(message: string, phone: string) {
    this.sms.send(phone, this.SMSsender, message);
  }
}
