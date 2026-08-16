import { getLogs } from "../db/queries";

// Returns log rows for the authenticated site within a date range.
// Query params: start=YYYY-MM-DD, end=YYYY-MM-DD
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const slug = session?.user?.slug;

  if (!slug) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const query = getQuery(event);
  const start = query.start as string;
  const end = query.end as string;

  if (!start || !end) {
    throw createError({
      statusCode: 400,
      message: "start and end query params are required (YYYY-MM-DD)",
    });
  }

  const logs = await getLogs(slug, start, end);
  return { logs };
});
