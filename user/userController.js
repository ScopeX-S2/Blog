const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require('bcryptjs')
const admin = require("../middlewares/adminAuth")
const userdef = require("../middlewares/userAuth")

router.get("/users", admin, (req, res) => {
    User.findAll().then(user => {
        res.render("admin/user", {
            user:user
        })
    })
})
router.post("/user/edit", admin, (req, res) => {
    var id = req.body.id
    

    User.findByPk(id).then(user => {
        res.render("admin/userEdit", {
            user: user
        })
    })
})
router.post("/user/update", admin, (req, res) => {
    var id = req.body.id
    var user = req.body.user
    var adm = req.body.adm

    User.update({
        user: user,
        useradm: adm
    },{
        where: {id: id}
    }).then(() => {
        res.redirect("/users")
    }).catch((err) => {
        res.send("Erro: "+ err)
    })
})
router.post("/user/delete", admin,(req, res) => {
    var id = req.body.id
    var user = req.body.user

    User.destroy({where: {id: id}}).then(() => {
        res.redirect("/users")
        console.log("O usuário "+ user +" foi deletado com sucesso!")
    }).catch((err) => {
        res.send("Erro: "+ err)
    })
})
router.get("/users/create", (req, res) => {
        res.render("admin/users/index")

})
router.post("/create", (req, res) => {
    var user = req.body.user
    var password = req.body.password
    var useradm = 0

    User.findOne({where: {user: user}}).then(users => {
        if(users == undefined) {
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)
        
            User.create({
                user: user,
                password: hash,
                useradm: useradm
            }).then(() => {
                res.redirect("/")
                console.log("O usuário " + user + " Foi cadastrado com sucesso!")
            }).catch((err) => {
                res.redirect("/users/create")
            })
        }else {
            res.redirect("/users/create")
        }
    })
    
})
router.post("/authenticate", (req, res) => {
    var user = req.body.user
    var password = req.body.password

    
    User.findOne({where: {user: user}}).then(users => {
        if(users != undefined) {
            var corrent = bcrypt.compareSync(password,users.password)

            if(users.useradm == 1) {
                req.session.admin = {
                    id: users.id,
                    user: users.user
                }
                res.redirect("/admin")
            }else {
                if(corrent) {
                    req.session.user = {
                        id: users.id,
                        user: users.user
                    }
                    res.redirect("/")
                }else {
                    res.redirect("/users/create")
                }
            }

        }else {
            res.redirect("/users/create")
        }
    })
})
router.get("/logout", (req, res) => {
    req.session.user = undefined; req.session.admin = undefined
    res.redirect("/users/create")
})
module.exports = router