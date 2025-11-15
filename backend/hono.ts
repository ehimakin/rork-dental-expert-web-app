import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

console.log('✅ Hono backend starting...');

app.use("*", cors());

app.use("*", async (c, next) => {
  console.log(`🔵 Incoming request: ${c.req.method} ${c.req.url}`);
  await next();
  console.log(`🟢 Response status: ${c.res.status}`);
});

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      console.error(`❌ tRPC Error on '${path}':`, error);
      console.error(`Error message:`, error.message);
      console.error(`Error stack:`, error.stack);
    },
  })
);

app.get("/", (c) => {
  console.log('✅ Root endpoint hit');
  return c.json({ status: "ok", message: "API is running" });
});

app.get("/api", (c) => {
  console.log('✅ /api endpoint hit');
  return c.json({ status: "ok", message: "API endpoint" });
});

app.get("/api/health", (c) => {
  console.log('✅ Health check endpoint hit');
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.notFound((c) => {
  console.log(`⚠️ 404 Not Found: ${c.req.url}`);
  return c.json({ error: "Not Found", path: c.req.url }, 404);
});

export default app;
