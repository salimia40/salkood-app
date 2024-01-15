export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      DATABASE_URL: string;
      AUTH_TOKEN: string;
      FCM_KEY: string;
      CHAT_HOST: string;
      CHAT_SECRET: string;
      CHAT_KEY: string;
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: string;
      VAPID_PRIVATE_KEY: string;
      VAPID_SUBJECT: string;
      GCM_API_KEY: string;
      SMS_USERNAME: string;
      SMS_PASSWORD: string;
      SMS_SENDER: string;
      HASHNODE_TOKEN: string;
    }
  }
}
