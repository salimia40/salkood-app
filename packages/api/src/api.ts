import { prisma } from "db";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.post(
  "/users/:userId/online",
  zValidator(
    "param",
    z.object({
      userId: z.string(),
    }),
  ),
  zValidator(
    "json",
    z.object({
      online: z.boolean(),
    }),
  ),
  async (c) => {
    const userId = c.req.param("userId");
    const { online } = await c.req.valid("json");

    if (!userId) {
      return c.json({
        success: false,
      });
    }

    await prisma.onlineStatus.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        online,
      },
      update: {
        online,
      },
    });

    return c.json({
      success: true,
    });
  },
);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export type AppType = typeof app;
