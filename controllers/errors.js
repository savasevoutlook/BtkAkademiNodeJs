module.exports.get404Page = (req, res, next) => {
    res.status(404).render('error/404', {
        title: 'Page Not Found',
    });
}

module.exports.get403Page = (req, res, next) => {
    res.status(403).render('error/403', {
        title: 'Unauthorized Access',
    });
}
