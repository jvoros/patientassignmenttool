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
  "addTriage",
  "assignToShift",
  "assignToZone",
  "reassign",
  "changeRoom",
];

type Action = {
  type: string;
  payload: any;
};

const undoAction = async (currentBoard: Board): Promise<Board> => {
  if (!currentBoard.undo) throw new Error("No undo ID");
  const { data, error } = await db.getUndo(currentBoard.undo);
  if (error || !data) throw new Error((error as string) || "No Undo state.");
  // If undoing 'reset' need to delete the logs that were saved on initial reset
  // first event in timeline is shift signIn that triggered the reset
  // second event is the reset event
  if (
    currentBoard.events[currentBoard.timeline[1]].message?.includes("reset")
  ) {
    const resetEvent = currentBoard.events[currentBoard.timeline[1]];
    db.deleteLogs(Number(resetEvent.note) || 0, currentBoard.slug);
    console.log(`[server][${currentBoard.slug}]: deleted logs on undo reset`);
  }
  return JSON.parse(data.board as string);
};

const handleAction = async (
  currentBoard: Board,
  action: Action,
): Promise<Board> => {
  if (!handlers.includes(action.type))
    throw new Error(`No action.type: ${action.type}`);

  if (action.type === "undo") return undoAction(currentBoard);

  if (action.type === "signIn" && action.payload?.schedule.reset) {
    const siteRes = await db.getSite(currentBoard.slug);
    action.payload.siteConfig = JSON.parse(siteRes.data?.site as string);
  }

  const { board, oldboard, error, logs } = Board[action.type](
    currentBoard,
    action.payload,
  );

  if (error) throw error;
  if (logs) {
    db.saveLogs(logs);
    console.log(`[server][${board.slug}] saved logs.`);
  }
  const addUndo = await db.addUndo(oldboard);
  const undoID = addUndo.lastInsertRowid;

  return { ...board, undo: Number(undoID) };
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

    if (process.env.DEV === "true") {
      console.log(`[server][${c.get("site")}] set 'dev' environment`);
      newBoard.dev = true;
    }
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
  if (!data) return c.json({ data: "error", error });
  const currentBoard = JSON.parse(data.board as string);

  try {
    const nextBoard = await handleAction(currentBoard, action);
    await db.updateBoard(site, nextBoard);
    io.to(site).emit("board", nextBoard);
    return c.json({ data: "success", error: false });
  } catch (err: any) {
    console.error(`[server][${site}] action error caught:`, err);
    return c.json({ data: "error", error: err.message });
  }
});

export default core;
