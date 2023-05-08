const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

const pool = require('../database')
const { encryptPassword, matchPassword } = require('../lib/helpers')

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query("SELECT * FROM user WHERE BINARY username = ?", [username])
     console.log(rows)
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await matchPassword(password, user.password)
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        } else {
            done(null, false, req.flash('message','Contraseña Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message','Usuario no encontrado'));
    }

}))

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    let encrypted =await encryptPassword(password)
    const query = `INSERT INTO user (user, password) VALUES ('${username}', '${encrypted}')`;
    console.log(query)
    try {
    const rows = await pool.query(`INSERT INTO user (username, password) VALUES ('${username}', '${encrypted}')`)
    done(null, user, req.flash('success', 'Bienvenido ' + user.username));
}
catch{
    done(null, false, req.flash('messas', 'Error uploading user'));
}
    
     
    
    

    

}))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    done(null, rows[0]);
})