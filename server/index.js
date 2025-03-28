import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import apiRoutes from "./routes/apiRoutes.js";

const app = new Hono();

app.route("/api", apiRoutes);

// VITE BUILT FILES

// paths relative to project root, not this file
// client/assets
app.get("/assets/*", serveStatic({ root: "./dist/client" }));
// client/public
app.get("/*", serveStatic({ root: "./dist/client" }));
// client/index.html
app.get("/", serveStatic({ path: "./dist/client" }));

// START
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
