const express = require('express');
const router = express()
const slug = require("slugify")
const { default: slugify } = require("slugify");
const Category = require("../Categories/Category");
const Article = require('./Article.js');

router.get("/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articleNew", {
            Category: categories
        })
    })

})
router.post("/articles/save", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.create({
        title: title,
        slug: slug(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/")
    }).catch((error) => {
        console.log(error)
        res.redirect("/articles/new")
    })
})
router.get("/articles", (req, res) => {
    Article.findAll({raw: true, order:[['ID', 'DESC']]}).then(article => {
            res.render("admin/articles", {
                article: article
            
        })
    })
})
router.post("/article/edit", (req, res) => {
        var id = req.body.id;
        Article.findByPk(id).then(article => {
            Category.findAll({raw: true}).then(categories => {
                res.render("admin/articleEdit", {
                    Category: categories,
                    article: article
                })
            }).catch(error => {
                res.redirect("/")
            })
        })
    })

router.post("/article/delete", (req, res) => {
    var id = req.body.id

    if (id != undefined){
        if (!isNaN(id)) {
            Article.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect("/articles")
            })
        }else {
            res.redirect("/articles")
        }
    }else {
        res.redirect("/articles")
    }
})
router.post("/article/update", (req, res) => {
    var id = req.body.id
    var title = req.body.title
    var category = req.body.category
    var body = req.body.body

    Article.update({
        title: title,
        slug: slug(title),
        categoryId: category,
        body: body
    },{
        where: {id: id}
    }).then(() => {
        res.redirect("/articles")
    })
})
module.exports = router;