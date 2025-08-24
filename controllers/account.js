const User = require("../models/user");
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/login', {
        title: 'Login',
        path: '/login',
        errorMessage: errorMessage,
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let foundUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.session.errorMessage = 'Invalid email or password.';
                req.session.save(err => {
                    if (err) {
                        console.log(err);
                    }

                    return res.redirect('/login');
                });
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
                    if (err) {
                        console.log(err);
                    }

                    var url = req.session.redirectTo || '/';
                    delete req.session.redirectTo;
                    return res.redirect(url);
                });
            }

            req.session.errorMessage = 'Invalid email or password.';
            req.session.save(err => {
                if (err) {
                    console.log(err);
                }

                return res.redirect('/login');
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
}

exports.getRegister = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/register', {
        title: 'Register',
        path: '/register',
        errorMessage: errorMessage,
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
            req.session.errorMessage = 'Username or email already exists.';
            req.session.save(err => {
                if (err) {
                    console.log(err);
                }

                return res.redirect('/register');
            });
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
