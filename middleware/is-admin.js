module.exports = (req, res, next) => {
    if (!req.user) {
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/login');
    } else if (!req.user.isAdmin) {
        return res.redirect('/unauthorized');
    }

    next();
}
