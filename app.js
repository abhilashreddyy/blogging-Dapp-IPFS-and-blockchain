var bodyParser = require("body-parser"),
    express    = require("express"),
    app        = express();


//APP CONFIG
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.static("blog"));
app.use(bodyParser.urlencoded({extended:true}));




//RESTFUL ROUTES

app.get("/",function(req,res){
	res.redirect("/blogs");
});

//INDEX
app.get("/blogs",function(req,res){
	console.log("find : ",req.params);
  res.render("index")
});

//NEW BLOG
app.get("/blogs/new",function(req,res){
	res.render("new");
});



//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
  console.log("show specific blog : ",req.params);
  blog = {hash : req.params.id};
  res.render("show",blog);
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
  console.log("edit : ",req.params);
  blog = {hash : req.params.id};
  res.render("edit",blog)
});




app.listen(8001,function(){

console.log("The Blog Server is running at localhost 8001");

});
