export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      MASTER_KEY: string;
      JWT_SECRET: string;
      REDIS_HOST: string;
      MASTER_HOST: string;
    }
  }
}
