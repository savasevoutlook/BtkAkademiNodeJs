const User = require("../models/user");
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

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
                        next(err);
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
                        next(err);
                    }

                    var url = req.session.redirectTo || '/';
                    delete req.session.redirectTo;
                    return res.redirect(url);
                });
            }

            req.session.errorMessage = 'Invalid email or password.';
            req.session.save(err => {
                if (err) {
                    next(err);
                }

                return res.redirect('/login');
            });
        })
        .catch(err => {
            next(err);
        });
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err);
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
                    next(err);
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
    .then((user) => {
        const msg = {
            to: user.email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Hesabınız Oluşturuldu',
            html: '<h4>Hesabınız başarıyla oluşturuldu.</h4>',
        };

        sgMail.send(msg)
            .then(() => {}, error => {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body)
                }
            });

        res.redirect('/login');
    })
    .catch(err => {
        next(err);
    });
}

exports.getResetPassword = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/reset-password', {
        title: 'Reset Password',
        path: '/reset-password',
        errorMessage: errorMessage,
    });
}

exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            next(err);
            return res.redirect('/reset-password');
        }

        const token = buffer.toString('hex');
        
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.session.errorMessage = 'No account with that email found.';
                    req.session.save(err => {
                        if (err) {
                            next(err);
                        }

                        return res.redirect('/reset-password');
                    });
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
                return user.save();
            })
            .then(user => {
                res.redirect('/');

                const msg = {
                    to: user.email,
                    from: process.env.SENDGRID_FROM_EMAIL,
                    subject: 'Parola Sıfırlama',
                    html: `
                        <h4>Parolanızı değiştirmek için aşağıdaki linke tıklayınız.</h4>
                        <p>
                            <a href="http://localhost:3000/reset/${user.resetToken}">Parola Sıfırlama Linki</a>
                        </p>
                    `,
                };

                sgMail.send(msg)
                    .then(() => {}, error => {
                        console.error(error);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    });
            })
            .catch(err => {
                next(err);
            });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.session.errorMessage = 'Invalid or expired token.';
                req.session.save(err => {
                    if (err) {
                        next(err);
                    }

                    return res.redirect('/reset-password');
                });
            }

            var errorMessage = req.session.errorMessage;
            delete req.session.errorMessage;

            res.render('account/new-password', {
                title: 'New Password',
                errorMessage: errorMessage,
                userId: user._id,
                passwordToken: token,
            });
        })
        .catch(err => {
            next(err);
        });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: {
            $gt: Date.now()
        }
    })
    .then(user => {
        if (!user) {
            req.session.errorMessage = 'Invalid or expired token.';
            req.session.save(err => {
                if (err) {
                    next(err);
                }

                return res.redirect('/reset-password');
            });
        }

        resetUser = user;
        return bcrypt.hash(newPassword, 10);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(() => {
        res.redirect('/login');
    })
    .catch(err => {
        next(err);
    });
}
