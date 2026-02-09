const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Generte JWT
        const token = jwt.sign({ id: req.user.id, isAdmin: req.user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Redirect to frontend with token
        // In production, might want to send this differently (cookie, or redirect param)
        // For now assuming localhost frontend
        res.redirect(`http://localhost:5173/login?token=${token}`);
    }
);

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
