import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import ShortUniqueId from "short-unique-id";

const auth = new Hono();
const uid = new ShortUniqueId({ length: 6 });

// auth routes
auth.post("/login", async (c) => {
  const { site, code } = await c.req.json();
  if (code && code.toString() === process.env.ACCESS_TOKEN?.toString()) {
    const payload = {
      role: "user",
      id: uid.rnd(),
      site,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    const token = await sign(payload, process.env.JWT_SECRET);
    setCookie(c, "auth", token, {
      httpOnly: true,
      sameSite: "Strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return c.json(payload);
  } else {
    return c.json({ message: "Invalid access code" }, 401);
  }
});

auth.post("/logout", async (c) => {
  deleteCookie(c, "auth");
  return c.json({ message: "Logged out" });
});

auth.post("/checkLogin", async (c) => {
  const token = getCookie(c, "auth");
  if (token) {
    try {
      const payload = await verify(token, process.env.JWT_SECRET);
      return c.json(payload);
    } catch {
      return c.json({ message: "Invalid token" }, 400);
    }
  }
  if (!token) {
    return c.json({ message: "No token" }, 401);
  }
  return;
});

export default auth;
