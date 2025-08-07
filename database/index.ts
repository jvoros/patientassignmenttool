// @ts-ignore
import { turso } from "./client.js";

const query = async (sql: string, args: any) => {
  try {
    const data = await turso.execute({ sql, args });
    return { data: data.rows[0], error: false };
  } catch (err) {
    return { error: err };
  }
};

const getBoardSql = `
  SELECT board
  FROM sites
  WHERE slug = :slug
  `;

const updateBoardSql = `
  UPDATE sites
  SET board = :newBoard
  WHERE slug = :slug
  `;

const getSiteSql = `
  SELECT site
  FROM sites
  WHERE slug = :slug
  `;

const updateLogsSql = `
  INSERT OR REPLACE INTO logs (date, site, shift, provider, assigned, supervised, bounty)
  VALUES (:date, :site, :shift, :provider, :assigned, :supervised, :bounty)
  `;

const deleteLogsSql = `
  DELETE FROM logs
  WHERE date = :date AND site = :site
  `;

const logQuery = async (logs: LogItem[]) => {
  const mappedParams = logs.map((log) => ({
    sql: updateLogsSql,
    args: { ...log, bounty: log.bounty ?? 0 },
  }));
  try {
    const res = await turso.batch(mappedParams, "write");
    return { data: "success", error: false };
  } catch (err) {
    return { error: err };
  }
};

export default {
  getBoard: async (slug: string) => await query(getBoardSql, { slug }),

  updateBoard: async (slug: string, newBoard: Board) => {
    return query(updateBoardSql, { slug, newBoard: JSON.stringify(newBoard) });
  },

  getSite: async (slug: string) => await query(getSiteSql, { slug }),

  saveLogs: async (logs: LogItem[]) => await logQuery(logs),

  deleteLogs: async (date: number, site: string) =>
    await query(deleteLogsSql, { date, site }),
};
