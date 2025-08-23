const { doubleCsrf } = require('csrf-csrf');

const {
    doubleCsrfProtection,
    generateCsrfToken,
    invalidCsrfTokenError
} = doubleCsrf({
    getSecret: () => "a_very_secret_random_string",
    getSessionIdentifier: (req) => req.session.id,
    cookieName: "__Host-psifi.x-csrf-token",
    cookieOptions: {
        sameSite: "strict",
        path: "/",
        //secure: process.env.NODE_ENV !== "production",
        secure: true,
        httpOnly: true,
    },
    size: 32,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getCsrfTokenFromRequest: (req) => req.body._csrf || req.headers["x-csrf-token"],
});

module.exports = { doubleCsrfProtection, generateCsrfToken, invalidCsrfTokenError };
