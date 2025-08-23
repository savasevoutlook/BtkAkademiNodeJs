const { generateCsrfToken } = require('../utility/csrf');

module.exports = (req, res, next) => {
    res.locals.csrfToken = generateCsrfToken(req, res);
    console.log('CSRF Token generated and added to res.locals:', res.locals.csrfToken);
    next();
}
