import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

const auth = new Hono();
const uid = () => Math.random().toString(32).substring(2, 8);

const accessToken = process.env.ACCESS_TOKEN?.toString() ?? null;
const jwtSecret = process.env.JWT_SECRET ?? null;

export const verifyToken = async (token: string | undefined) => {
  if (!token || !jwtSecret) return { status: "noauth", message: "No secret" };
  try {
    const payload = await verify(token, jwtSecret);
    return { isAuth: true, payload };
  } catch {
    console.log("[auth] verifyToken fail");
    return { isAuth: false };
  }
};

// routes
auth.post("/login", async (c) => {
  if (!accessToken || !jwtSecret) {
    throw Error("Missing ACCESS_TOKEN or JWT_SECRET");
  }

  const { site, code } = await c.req.json();
  if (code && code.toString() === accessToken) {
    const payload = {
      role: "user",
      id: uid(),
      site,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    const token = await sign(payload, jwtSecret);
    setCookie(c, "auth", token, {
      httpOnly: true,
      sameSite: "Strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return c.json(token);
  } else {
    return c.json({ message: "Invalid access code" }, 401);
  }
});

auth.post("/logout", async (c) => {
  deleteCookie(c, "auth");
  return c.json({ status: "success", message: "Logged out" });
});

auth.post("/checklogin", async (c) => {
  if (!jwtSecret) throw Error("No JWT_SECRET");
  const token = getCookie(c, "auth");
  const { isAuth, payload } = await verifyToken(token);
  if (token && isAuth) {
    return c.json(token);
  }
  return c.json({ status: "noauth", message: "No token" });
});

export default auth;
