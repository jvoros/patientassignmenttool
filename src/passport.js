import * as dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import LocalStrategy from 'passport-local';

const env = process.env.NODE_ENV || 'development';

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const googleStrategy = new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT,    
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: (env == 'development') ? "http://localhost:4000/account/google" : process.env.GOOGLE_CALLBACK  },
    function(accessToken, refreshToken, profile, done) {
        if (profile._json.hd !== 'carepointhc.com') {
            done(new Error("Wrong domain. Use an @carepointhc.com email address"));
        } else {
            // set up user fields that app needs
            done(null, { 
                id: profile.id, 
                name: profile.displayName, 
                role: 'user' 
            });
        }
  }
);

const userTable = {
    'triage': { 'pass': process.env.PASS, 'role': 'admin' },
    'doctor': { 'pass': process.env.DOC_PASS, 'role': 'user' }
}
const localStrategy = new LocalStrategy.Strategy({
        usernameField: "username",
        passwordField: "password"
    },(username, password, done) => {
    // stupidly simple password compare
    // return object same shape as Google Strategy added to req.user by middleware
    if (password == userTable[username].pass) {
        return done(null, {
            name: username,
            role: userTable[username].role
        });
    } else {
        console.log('failed authentication: ', username);
        return done(null, false,{ message: 'Incorrect username or password.' });
    }    
});

passport.use(googleStrategy);
passport.use(localStrategy);

export default passport;
