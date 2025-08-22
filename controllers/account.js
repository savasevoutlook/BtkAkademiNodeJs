exports.getLogin = (req, res, next) => {
    res.render('account/login', {
        title: 'Login',
        path: '/login'
    });
}

exports.postLogin = (req, res, next) => {
    
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
    res.render('account/register', {
        title: 'Reset Password',
        path: '/reset-password'
    });
}

exports.postResetPassword = (req, res, next) => {
    
}
