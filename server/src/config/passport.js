const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const googleId = profile.id;

                // 1. Try to find by googleId
                let user = await User.findOne({ where: { googleId } });

                if (user) {
                    return done(null, user);
                }

                // 2. Try to find by email (for users who registered with password before)
                user = await User.findOne({ where: { email } });

                if (user) {
                    // Link account
                    user.googleId = googleId;
                    await user.save();
                    return done(null, user);
                }

                // 3. If not found, create new user
                user = await User.create({
                    googleId,
                    name: profile.displayName,
                    email,
                    isAdmin: false,
                });

                done(null, user);
            } catch (err) {
                console.error('Passport Google Strategy Error:', err);
                done(err, null);
            }
        }
    ));
}

// Serialize/Deserialize not strictly needed if using manual JWT generation in routes,
// but good practice if we switch to sessions.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
