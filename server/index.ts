import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import useSocket from "./io.js";
import core from "./core.js";
import auth from "./auth.js";

// server
const app = new Hono();
const port = 3000;
const honoServer = serve({
  fetch: app.fetch,
  port,
});
console.log(`Server is running on http://localhost:${port}`);

// websocket
export const io = useSocket(honoServer);

// routes
// all routes for frontend to fetch
// at '/api/*' to make vite proxy easy
app.all("api/board", (c) => {
  return c.json({ data: "success" });
});
app.route("api/core", core);
app.route("api/auth", auth);

// VITE routes
// paths relative to project root, not this file
// client/assets
app.use("/assets/*", serveStatic({ root: "./dist/client" }));
// client/public
app.use("/*", serveStatic({ root: "./dist/client/" }));
// client/index.html
app.use("/", serveStatic({ path: "./dist/client/index.html" }));
