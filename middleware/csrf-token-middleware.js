const { generateCsrfToken } = require('../utility/csrf');

module.exports = (req, res, next) => {
    res.locals.csrfToken = generateCsrfToken(req, res);
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.isAdmin = req.user ? req.user.isAdmin : false;

    next();
}
