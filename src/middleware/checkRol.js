module.exports = {
    administrador: (req, res, next) => {
        if (req.session.userLogin && req.session.userLogin.CategoryId === 1) {
            return next();
        } else if (req.session.userLogin && (req.session.userLogin.CategoryId === 2)) {
            return res.redirect('/');
        } else {
            return res.redirect('/users/login');
        }
    }
}
