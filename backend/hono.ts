import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors());

app.all(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      console.error(`❌ tRPC Error on '${path}':`, error);
      console.error(`Error stack:`, error.stack);
    },
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.get("/api/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.notFound((c) => {
  console.log(`⚠️ 404 Not Found: ${c.req.url}`);
  return c.json({ error: "Not Found", path: c.req.url }, 404);
});

export default app;
