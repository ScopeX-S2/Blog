var userdef = (req, res, next) => {
    if(req.session.user != undefined) {
        next()
    }else {
        res.redirect("/users/create")
    }
}

module.exports = userdef;