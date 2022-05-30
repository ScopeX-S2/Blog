const express = require("express")
const router = express();
const Category = require("./Category")
const Article = require("../Articles/Article")
const slug = require("slugify");
const { default: slugify } = require("slugify");
const { is } = require("express/lib/request");

router.get("/categories", (req, res) => {
    Category.findAll({raw: true, order: [['title', 'ASC']]}).then(Category => {
        res.render("admin/categories", {
            category: Category
        })
    })
})
router.get("/category/new", (req, res) => {
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
router.post("/category/delete", (req, res) => {
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
router.post("/category/edit", (req, res) => {
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

router.post("/category/update", (req, res) => {
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
router.get("/page/:page", (req, res) => {
    var page = req.params.page;

    Article.findAndCountAll().then(article => {
        res.json(article)
    })
})
module.exports = router;