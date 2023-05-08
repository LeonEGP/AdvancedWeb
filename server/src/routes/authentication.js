const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const { encryptPassword, matchPassword } = require('../lib/helpers')

const pool = require('../database');

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin')
})
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login')
})

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/characters',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
    // res.json({"success": "true"})
})
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/characters',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
    // res.json({"success": "true"})
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
})

router.post('/change-password', isLoggedIn, async (req, res) => {
    const { newPassword, repeatPassword } = req.body;
    if (newPassword !== repeatPassword) {
        req.flash('message', 'Las contraseñas no coinciden');
        res.redirect('/profile')
    } else {
        const newUser = {
            password: await encryptPassword(newPassword)
        }
        await pool.query('UPDATE user set ? WHERE id = ?', [newUser, req.user.id])
        req.flash('success', 'Contraseña actualizada correctamente');
        res.redirect('/profile')
    }
});



module.exports = router;