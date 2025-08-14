import { Hono } from "hono";
import { jwt } from "hono/jwt";
import db from "../database/index.js";
import Board from "../core/index.js";
import { io } from "./index.js";

type Variables = {
  site: string;
};

const core = new Hono<{ Variables: Variables }>();

// MIDDLEWARE
// Get site from JWT token

core.use(jwt({ secret: process.env.JWT_SECRET!, cookie: "auth" }));
core.use(async (c, next) => {
  const payload = c.get("jwtPayload");
  c.set("site", payload.site);
  await next();
});

// CORE REDUCER
// one entry for each method of core library to ensure correct function call

const handlers = [
  "reset",
  "undo",
  "signIn",
  "signOut",
  "joinZone",
  "leaveZone",
  "switchZone",
  "deleteShift",
  "adjustRotation",
  "togglePause",
  "assignToShift",
  "assignToZone",
  "reassign",
  "changeRoom",
];

type Action = {
  type: string;
  payload: object;
};

const reducer = (
  currentBoard: Board,
  action: Action,
): { board: Board; oldboard: Board } => {
  if (!handlers.includes(action.type)) {
    return { board: currentBoard, oldboard: currentBoard };
  }

  const { board, oldboard, error, logs } = Board[action.type](
    currentBoard,
    action.payload,
  );

  if (error) throw error;

  if (logs) {
    db.saveLogs(logs);
  }

  // Handle undo reset and delete logs if necessary
  if (
    action.type === "undo" &&
    currentBoard.events[currentBoard.timeline[0]].message?.includes("reset")
  ) {
    const resetEvent = currentBoard.events[currentBoard.timeline[0]];
    db.deleteLogs(Number(resetEvent.note) || 0, currentBoard.slug);
  }

  return { board, oldboard };
};

// ROUTES

core.all("/board", async (c) => {
  const res = await db.getBoard(c.get("site"));
  // turso empty row is string "null"
  if (res.data?.board === "null") {
    console.log(`[server][${c.get("site")}] no board in database, building...`);
    const siteRes = await db.getSite(c.get("site"));
    const siteConfig = JSON.parse(siteRes.data?.site as string);
    const newBoard = Board.build({ slug: c.get("site"), siteConfig });
    db.updateBoard(newBoard.slug, newBoard);
    return c.json({ data: { board: JSON.stringify(newBoard) }, error: false });
  }
  return c.json(res);
});

core.all("/site", async (c) => {
  const res = await db.getSite(c.get("site"));
  return c.json(res);
});

core.post("/action", async (c) => {
  const site = c.get("site");
  const action = await c.req.json();
  const { data, error } = await db.getBoard(site);

  if (!data) {
    return c.json({ data: "error", error });
  }

  const currentBoard = JSON.parse(data.board as string);

  try {
    if (action.type === "undo") {
      const undoRes = await db.getUndo(currentBoard.undo);
      if (undoRes.error) throw new Error(undoRes.error as string);
      const oldBoard = JSON.parse(undoRes.data?.board as string);
      await db.updateBoard(site, oldBoard);
      io.to(site).emit("board", oldBoard);
    } else {
      const { board, oldboard } = reducer(currentBoard, action);
      const newBoard = JSON.parse(JSON.stringify(board)); // Immutable copy
      // TODO: consider turso transaction for these two db acctions
      const undoRes = await db.addUndo(oldboard);
      newBoard.undo = Number(undoRes.lastInsertRowid);
      await db.updateBoard(site, newBoard);
      io.to(site).emit("board", newBoard);
    }
    return c.json({ data: "success", error: false });
  } catch (err: any) {
    console.error("caught error:", err);
    return c.json({ data: "error", error: err.message });
  }
});

export default core;
