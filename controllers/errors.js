module.exports.get404Page = (req, res, next) => {
    res.status(404).render('error/404', { title: 'Page Not Found' });
};
