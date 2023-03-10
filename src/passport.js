import * as dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import LocalStrategy from 'passport-local';

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const googleStrategy = new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT,    
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:4000/account/google"  },
    function(accessToken, refreshToken, profile, done) {
        if (profile._json.hd !== 'carepointhc.com') {
            done(new Error("Wrong domain. Use an @carepointhc.com email address"));
        } else {
            done(null, profile);
        }
  }
);

const localStrategy = new LocalStrategy.Strategy({
        usernameField: "username",
        passwordField: "password"
    },(username, password, done) => {
    console.log('localStrategy happening...');
    // stupidly simple password compare
    // return object same shape as Google Strategy added to req.user by middleware
    // add localRole property for admin middleware
    if (username == 'triage' && password == process.env.PASS) {
        return done(null, {
            "id": "1",
            "displayName":"Triage Nurse",
            "name": {"familyName":"Nurse", "givenName":"Triage"},
            "localRole": 'admin'
        });
    } else {
        console.log('failed authentication');
        return done(null, false,{ message: 'Incorrect username or password.' });
    }    
});

passport.use(googleStrategy);
passport.use(localStrategy);

export default passport;
