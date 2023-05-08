


module.exports = {
    
    isLoggedIn(req, res, next) {
        console.log(req)
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/characters');
        }
    }

}
