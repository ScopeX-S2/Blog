const express = require("express")
const router = express();
const Category = require("./Category")
const Article = require("../Articles/Article")
const admin = require("../middlewares/adminAuth")
const slug = require("slugify");
const { default: slugify } = require("slugify");
const { is } = require("express/lib/request");

router.get("/categories", admin, (req, res) => {
    Category.findAll({raw: true, order: [['title', 'ASC']]}).then(Category => {
        res.render("admin/categories", {
            category: Category
        })
    })
})
router.get("/category/new", admin, (req, res) => {
    res.render("admin/categoryNew")
})
router.post("/category/save", (req, res) => {
    var title = req.body.title;

    if(title != undefined) {
        Category.create({
            title: title,
            slug: slug(title)
        }).then(() => {
            res.redirect("/categories")
        })
    }else {
        res.redirect("/category")
    }
})
router.post("/category/delete", admin, (req, res) => {
    var id = req.body.id

    if (id != undefined){
        if (!isNaN(id)) {
            Category.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect("/categories")
            })
        }else {
            res.redirect("/categories")
        }
    }else {
        res.redirect("/categories")
    }
})
router.post("/category/edit", admin, (req, res) => {
    var id = req.body.id
    Category.findByPk(id).then(categories => {
        if(categories != undefined) {
            res.render("admin/categoryEdit", {
                category: categories
            })
        }else {
            res.redirect("/categories")
        }
        }).catch(()=> {
            res.redirect("/categories")
        })
    })

router.post("/category/update", admin, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var category = req.body.category
    var body = req.body.body

    Category.update({
        title: title,
        slug: slug(title)
        },{
        where: {
            id: id
        },
        include: [{model:Article}]
    }).then(() => {
        res.redirect("/categories")
    })
})
module.exports = router;