import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { streamSSE } from "hono/streaming";
import ShortUniqueId from "short-unique-id";
import { sites } from "./boardRoutes.js";
import hydrate from "../core/hydrate.js";

// setup
const stream = new Hono();
const uid = new ShortUniqueId({ length: 6 });

// helpers
const SITE_INCLUDES_CLIENT = (site, id) => {
  return sites[site].clients.findIndex((c) => c.id === id) !== -1;
};

export const broadcast = async (clients, event, data) => {
  clients.forEach(async (client) => {
    const id = uid.rnd();
    client.stream.writeSSE({
      event,
      data: JSON.stringify(data, null, 2),
      id,
    });
  });
};

// middleware
stream.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

// routes
stream.get("/", async (c) => {
  const { site, id } = c.get("jwtPayload");
  const clients = sites[site].clients;
  return streamSSE(c, async (stream) => {
    // add to client list for site if not already there
    if (!SITE_INCLUDES_CLIENT(site, id)) clients.push({ id, stream });
    console.log(`[${site}](clients: ${clients.length}) ${id} connected to stream`);

    // remove client from list when they disconnect
    stream.onAbort(() => {
      sites[site].clients = clients.filter((c) => c.id !== id);
      console.log(`[${site}](clients: ${clients.length}) ${id} disconnected from stream`);
    });

    stream.writeSSE({
      data: `connected to stream (${site}) with id (${id})`,
      event: "message",
    });

    stream.writeSSE({
      data: JSON.stringify(hydrate(sites[site].board), null, 2),
      event: "board",
    });

    while (SITE_INCLUDES_CLIENT(site, id)) {
      //console.log(clients);
      await stream.writeSSE({
        data: ": keep-alive",
        event: "ping",
      });
      await stream.sleep(15000);
    }
  });
});

export default stream;
