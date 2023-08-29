import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import LocalStrategy from "passport-local";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const userTable = {
  triage: { pass: process.env.PASS, role: "admin" },
  doctor: { pass: process.env.DOC_PASS, role: "user" },
};
const localStrategy = new LocalStrategy.Strategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  (username, password, done) => {
    // stupidly simple password compare
    // return object same shape as Google Strategy added to req.user by middleware
    if (password == userTable[username].pass) {
      return done(null, {
        name: username,
        role: userTable[username].role,
      });
    } else {
      console.log("failed authentication: ", username);
      return done(null, false, { message: "Incorrect username or password." });
    }
  }
);

passport.use(localStrategy);

export default passport;
