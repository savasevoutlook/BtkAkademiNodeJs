const User = require("../models/user");
const bcrypt = require('bcrypt');

exports.getLogin = (req, res, next) => {
    res.render('account/login', {
        title: 'Login',
        path: '/login'
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let foundUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/login');
            }

            foundUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isMatch => {

            if (isMatch === undefined) {
                return;
            }

            if (isMatch) {
                req.session.user = foundUser;
                req.session.isAuthenticated = true;

                return req.session.save(err => {
                    console.log(err);
                });
            }

            res.redirect('/login');
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(err => { console.log(err); });
}

exports.getRegister = (req, res, next) => {
    res.render('account/register', {
        title: 'Register',
        path: '/register'
    });
}

exports.postRegister = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        $or: [{ email: email }, { username: username }]
    })
    .then(user => {
        if (user) {
            return res.redirect('/register');
        }

        return bcrypt.hash(password, 10);
    })
    .then(hashedPassword => {
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });

        return newUser.save();
    })
    .then(() => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getResetPassword = (req, res, next) => {
    res.render('account/reset-password', {
        title: 'Reset Password',
        path: '/reset-password'
    });
}

exports.postResetPassword = (req, res, next) => {
    
}
