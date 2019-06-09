const express 		= require('express'),
	  methodOverride = require('method-override'),
	  expressSanitizer = require('express-sanitizer'),
	  mongoose 		= require('mongoose'),
	  bodyParser 	= require("body-parser"),
	  app 			= express();

//APP CONFIG
mongoose.connect('mongodb://localhost/restufl_blog_app', {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
const Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1559557126-c1f6913d8c16?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
// 	body: 'HELLO THIS IS A BLOG POST'
// });
//RESTFUL ROUTES
app.get('/', (req, res) => {
	res.redirect("/blogs");
});
//INDEX
app.get('/blogs', (req, res) => {
	Blog.find({}, (err, blogs) => {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new", (req,res) => {
	res.render('new');
});
//CREATE ROUTE
app.post("/blogs",(req,res) => {
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err, newBlog) => {
				if(err) {
					res.render("new");
				} else {
					//then, redirect to index
					res.redirect("/blogs");
				}
				});
	
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.render('show', {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put('/blogs/:id', (req,res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog , (err, updatedBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
	//destroy item
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
	//redirect
});

app.listen(3001, function() {
	console.log("SERVER IS RUNNING");
});