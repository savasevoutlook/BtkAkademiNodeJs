const { generateCsrfToken } = require('../utility/csrf');

module.exports = (req, res, next) => {
    res.locals.csrfToken = generateCsrfToken(req, res);
    res.locals.isAuthenticated = req.session.isAuthenticated;
    // console.log('CSRF Token: ' + res.locals.csrfToken);
    next();
}
