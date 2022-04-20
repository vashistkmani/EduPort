const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    }
    else{
        res.redirect("/sign-in");
    }
}

module.exports = isAuth;