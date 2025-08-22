const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render('account/login', {
        title: 'Login',
        path: '/login'
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email, password: password })
        .then(user => {
            if (user) {
                req.session.isAuthenticated = true;
                res.redirect('/');
            } else {
                req.session.isAuthenticated = false;
                res.redirect('/login');
            }
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
    
}

exports.getResetPassword = (req, res, next) => {
    res.render('account/reset-password', {
        title: 'Reset Password',
        path: '/reset-password'
    });
}

exports.postResetPassword = (req, res, next) => {
    
}
