import { useDb } from "./client";
import type { Board, SiteConfig } from "../core/types";

// ---- Types ----------------------------------------------------------------

export type SiteRow = {
  slug: string;
  config: SiteConfig;
  board: Board | null;
};

export type UndoRow = {
  id: number;
  board: Board;
  site: string;
  date: number;
};

// ---- Helpers --------------------------------------------------------------

// Returns the local calendar date string (YYYY-MM-DD) for a millisecond
// timestamp using the site's IANA timezone. Falls back to America/Denver.
const toCalDate = (ts: number, timeZone = "America/Denver"): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date(ts));

// Builds log rows from the current board state. Called on every board save
// so logs are always current and never need special end-of-day handling.
const buildLogArgs = (board: Board, timeZone: string) =>
  Object.values(board.shifts).map((shift) => [
    board.date,
    toCalDate(board.date, timeZone),
    board.slug,
    shift.name,
    `${shift.first} ${shift.last}`,
    shift.assigned,
    shift.supervised,
    shift.triaged,
  ]);

// ---- Logs ----------------------------------------------------------------

export type LogRow = {
  cal_date: string;
  shift: string;
  provider: string;
  assigned: number;
  supervised: number;
  triaged: number;
};

export const getLogs = async (
  slug: string,
  start: string,
  end: string,
): Promise<LogRow[]> => {
  const db = useDb();
  const result = await db.execute({
    sql: `SELECT cal_date, shift, provider, assigned, supervised, bounty
          FROM logs
          WHERE site = ?
            AND cal_date >= ?
            AND cal_date <= ?
          ORDER BY cal_date ASC`,
    args: [slug, start, end],
  });
  return result.rows.map((row) => ({
    cal_date: row.cal_date as string,
    shift: row.shift as string,
    provider: row.provider as string,
    assigned: (row.assigned as number) ?? 0,
    supervised: (row.supervised as number) ?? 0,
    triaged: (row.bounty as number) ?? 0,
  }));
};

// ---- Access codes --------------------------------------------------------

export type AccessCodeRow = {
  hash: string;
  salt: string;
};

// Returns the stored hash and salt for a site, used to verify a login attempt.
export const getAccessCode = async (
  slug: string,
): Promise<AccessCodeRow | null> => {
  const db = useDb();
  const result = await db.execute({
    sql: "SELECT access_code_hash, access_code_salt FROM sites WHERE slug = ?",
    args: [slug],
  });
  const row = result.rows[0];
  if (!row || !row.access_code_hash || !row.access_code_salt) return null;
  return {
    hash: row.access_code_hash as string,
    salt: row.access_code_salt as string,
  };
};

// Stores a new hashed access code for a site.
// Call hashCode() and generateSalt() from server/utils/auth.ts before saving.
export const setAccessCode = async (
  slug: string,
  hash: string,
  salt: string,
): Promise<void> => {
  const db = useDb();
  await db.execute({
    sql: "UPDATE sites SET access_code_hash = ?, access_code_salt = ? WHERE slug = ?",
    args: [hash, salt, slug],
  });
};

// ---- Sites ----------------------------------------------------------------

export const getSite = async (slug: string): Promise<SiteRow | null> => {
  const db = useDb();
  const result = await db.execute({
    sql: "SELECT slug, site, board FROM sites WHERE slug = ?",
    args: [slug],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    slug: row.slug as string,
    config: JSON.parse(row.site as string) as SiteConfig,
    board: row.board ? (JSON.parse(row.board as string) as Board) : null,
  };
};

// Saves the board state and rewrites the log rows for this board in one
// atomic batch. Works identically for normal actions and undos.
export const updateBoard = async (
  slug: string,
  board: Board,
  timeZone = "America/Denver",
): Promise<void> => {
  const db = useDb();
  const calDate = toCalDate(board.date, timeZone);
  const logRows = buildLogArgs(board, timeZone);
  await db.batch(
    [
      {
        sql: "UPDATE sites SET board = ? WHERE slug = ?",
        args: [JSON.stringify(board), slug],
      },
      // Remove any stale rows from a previous board reset on the same calendar day
      {
        sql: "DELETE FROM logs WHERE site = ? AND cal_date = ? AND date != ?",
        args: [slug, calDate, board.date],
      },
      ...logRows.map((args) => ({
        sql: `INSERT OR REPLACE INTO logs (date, cal_date, site, shift, provider, assigned, supervised, bounty)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args,
      })),
    ],
    "write",
  );
};

export const updateConfig = async (
  slug: string,
  config: SiteConfig,
): Promise<boolean> => {
  const db = useDb();
  const result = await db.execute({
    sql: "UPDATE sites SET site = ? WHERE slug = ?",
    args: [JSON.stringify(config), slug],
  });
  return result.rowsAffected > 0;
};

// ---- Undos ----------------------------------------------------------------

export const addUndo = async (board: Board): Promise<number> => {
  const db = useDb();
  const result = await db.execute({
    sql: "INSERT INTO undos (board, site, date) VALUES (?, ?, ?)",
    args: [JSON.stringify(board), board.slug, board.date],
  });
  return Number(result.lastInsertRowid);
};

export const getUndo = async (id: number): Promise<UndoRow | null> => {
  const db = useDb();
  const result = await db.execute({
    sql: "SELECT id, board, site, date FROM undos WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id as number,
    board: JSON.parse(row.board as string) as Board,
    site: row.site as string,
    date: row.date as number,
  };
};

// Removes undo rows older than 48 hours for a given site. Called on board reset.
// Keeping 48 hours of history allows recovery if a board is accidentally reset.
export const clearUndos = async (slug: string): Promise<void> => {
  const db = useDb();
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  await db.execute({
    sql: "DELETE FROM undos WHERE site = ? AND date < ?",
    args: [slug, cutoff],
  });
};
