import { getAccessCode } from "../../db/queries";
import { verifyCode } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const { slug, code } = await readBody<{ slug: string; code: string }>(event);

  if (!slug || !code) {
    throw createError({
      statusCode: 400,
      message: "slug and code are required",
    });
  }

  const site = await getAccessCode(slug);

  if (!site) {
    console.error(`[login] No site found for slug: "${slug}"`);
    throw createError({
      statusCode: 401,
      message: "Invalid site or access code",
    });
  }

  const valid = verifyCode(code, site.hash, site.salt);
  console.log(
    `[login] slug="${slug}" hash=${site.hash ? "present" : "missing"} salt=${site.salt ? "present" : "missing"} valid=${valid}`,
  );

  if (!valid) {
    throw createError({
      statusCode: 401,
      message: "Invalid site or access code",
    });
  }

  await setUserSession(event, { user: { slug } });
  return { ok: true };
});
