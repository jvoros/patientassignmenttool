import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

import BoardCore from "../core/board.js";
import { broadcast } from "./streamRoutes.js";

const boardRoutes = new Hono();
const prisma = new PrismaClient().$extends(withAccelerate());

// HELPERS
const getBoard = async (site) => {
  const data = await prisma.site.findFirst({
    where: { site },
    select: { board: true },
  });
  return data.board;
};

const getBoardHydrated = (site) => BoardCore.hydrate(sites[site].board);

const getSiteDetails = async (site) => {
  const data = await prisma.site.findFirst({
    where: { site },
    select: { details: true },
  });
  return data.details;
};

const broadcastBoard = async (site) => {
  console.log(`[${site}] board broadcasted`);
  broadcast(sites[site].clients, "board", getBoardHydrated(site));
};

// SETUP SITES
export const sites = {
  stmarks: {
    board: await getBoard("stmarks"),
    details: await getSiteDetails("stmarks"),
    clients: [],
  },
};

const refreshSiteFromDatabase = async (site) => {
  sites[site].board = await getBoard(site);
  sites[site].details = await getSiteDetails(site);
};

// MIDDLEWARE
boardRoutes.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

// ROUTES

boardRoutes.get("/getBoard", async (c) => {
  const site = c.get("jwtPayload").site;
  return c.json({ data: getBoardHydrated(site) });
});

boardRoutes.get("/getSiteDetails", async (c) => {
  const site = c.get("jwtPayload").site;
  return c.json({ data: sites[site].details });
});

boardRoutes.get("/refreshSiteFromDatabase", async (c) => {
  const site = c.get("jwtPayload").site;
  await refreshSiteFromDatabase(site);
  broadcastBoard(site);
  return c.text("Site Refreshed");
});

boardRoutes.post("/boardReset", async (c) => {
  const site = c.get("jwtPayload").site;
  const board = sites[site].board;
  const logs = BoardCore.buildLogs(site, board);
  const date = board.date;

  prisma.$transaction([
    prisma.log.deleteMany({ where: { date: date, site: site } }),
    prisma.log.createMany({ data: logs }),
  ]);

  const newBoard = BoardCore.reset(board);

  try {
    await prisma.site.update({
      where: { site },
      data: { board: newBoard },
    });
    sites[site].board = newBoard;
    broadcastBoard(site);
    return c.json({ message: "board reset" });
  } catch (error) {
    console.error(error);
    return c.json({ error: error.message });
  }
});

// PROGRAMMATIC ROUTES

// all the functions are just passed through to core BoardCore
// same JWT and payload extraction
// same error handling
// same broadcast
// this HOF just wraps it all
const wrapWithUpdate = (fn) => async (c) => {
  const site = c.get("jwtPayload").site;
  const payload = await c.req.json();
  const newBoard = BoardCore[fn](
    sites[site].board,
    ...Object.keys(payload).map((key) => payload[key])
  );
  // optimistically update board and broadcast
  sites[site].board = newBoard;
  broadcastBoard(site);
  // then update db, assuming it will work
  try {
    await prisma.site.update({
      where: { site },
      data: { board: newBoard },
    });
    return c.json({ message: fn + " broadcasted" });
  } catch (error) {
    console.error(error);
    return c.json({ error: error.message });
  }
};

// generate endpoint for each fn of Board
Object.keys(BoardCore).forEach((fn) => boardRoutes.post(`/${fn}`, wrapWithUpdate(fn)));

export default boardRoutes;
