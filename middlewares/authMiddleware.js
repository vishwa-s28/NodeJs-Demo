const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../schemas/userSchema");
const keys = require("../config/keys");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePhoto: profile.photos[0].value,
      });
      await newUser.save();
      done(null, newUser);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebook.appID,
      clientSecret: keys.facebook.appSecret,
      callbackURL: "/auth/facebook/callback",
      // profileFields: ["id", "emails", "name", "picture"], // Fields you want to access
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ facebookId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : "No email",
          profilePhoto: profile.photos ? profile.photos[0].value : "No photo",
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        console.error("Error during Facebook authentication:", error);
        done(error, null);
      }
    }
  )
);
