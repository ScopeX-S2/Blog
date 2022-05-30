const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController = require("./Categories/CategoriesController")
const articlesController = require("./Articles/ArticlesController")
const Article = require("./Articles/Article")
const Category = require("./Categories/Category");
const res = require("express/lib/response");
const PT = 8080
var manut = true;

//View Engine
app.set('view engine', 'ejs');

//CSS3
app.use(express.static('public'));

//Database
connection.authenticate().then(() => {console.log("Conexão ao banco de dados efetuada!")}).catch((error) => {console.log("Não foi possivel fazer a conexão ao banco de dados!")})

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Rotas
if(manut == true) {
    app.get("/", (req, res) => {
        Article.findAll({raw: true, order: [['id', 'DESC']]}).then(article => {                                 
            res.render("index", {
                article: article,
                manut: manut
            })
        })
})
app.get("/article/:slug", (req, res) => {
    var slug = req.params.slug

    Article.findOne({
        where: {slug: slug}
    }).then(article => {
        Category.findAll({raw: true, order: [['title', 'ASC']]}).then(category => {
            res.render("article", {
                article: article,
                category: category
            })
        })
    }).catch(error => {
        res.redirect("/")
    })
})
app.use("/", categoriesController)
app.use("/", articlesController)

}else {
    app.get("/", (req, res) => {
        res.send("Site em manutenção : )")
    })
    
}


//Server
app.listen(PT, () => {console.log("Running..."); console.log("O link para acesso é:"+ " localhost:"+ PT)});