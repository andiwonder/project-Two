
//dependencies
var express = require("express");
var app = express();
var fs = require("fs");
var ejs = require("ejs");
var geolocation = require('geolocation');
var request = require('request');

//middleware
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedBodyParser);
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/forum.db');
app.use(express.static('public'));



var randomlinks = ["AfuCLp8VEng?","uuWQyfGa1yI?","ewc1hixzYPY?","nzUY6Iiur6E?",
				   "eBG7P-K-r1Y?","CXPADwU05OQ?", "N2wqmGu1EY8?", "wycjnCCgUes?",
				   "L53gjP-TtGE?","7Dqgr0wNyPo?","DcHKOC64KnE?","kemivUKb4f4?start=17&",
				   "LHQqqM5sr7g?","6hzrDeceEKc?start=9&","kjmCWyBc67Y?","RIrG6xBW5Wk?",
				   "n7zyfArxibk?","ENBv2i88g6Y?start=20&","7XVWR-5fiG0?","IpT5SBg1Mmk?",
				   "3Z_Ys3BO_4M?","1osmNEp2XGc?","KJ19PJ7-SWc?start=18&","XDrrUvDNtLo?",
				   "zYy2_CLAyVU?","xrPcM1lh0Jg?start=14&","Kw2zJiKT2wI?","YCe1gC5VaW4?",
				   "Q5YsjzwLaE0?","rVeMiVU77wo?"]

// var link = "rVeMiVU77wo?"



app.listen(3000,function(){
	console.log("Here We Go!")
});

app.get("/",function (req,res){
	var link = randomlinks[Math.floor(Math.random()*randomlinks.length)];
	var html = fs.readFileSync("./views/index.html.ejs","utf8");
	var rendered = ejs.render(html,{link:link});
	res.send(rendered);
})

app.get("/forums/new",function (req,res){
	console.log("hi!");
	requestURL = "http://ip-api.com/json";
	console.log(requestURL)

	request.get(requestURL , function (err, response , body) {
		var parsedJSON = JSON.parse(body);
		apimovie = parsedJSON;
		console.log(apimovie);
		var html = fs.readFileSync("./views/new.html.ejs","utf8");
		var rendered = ejs.render(html);
		res.send(rendered);
	})

})

app.post("/forums",function (req,res){
	console.log(req.body.user_name, req.body.title, req.body.topic , req.body.topic_id , req.body.content , req.body.last_updated , req.body.votes);
	db.run("INSERT INTO forums(user_id, title, topic, topic_id, content, last_updated, votes) VALUES (?,?,?,?,?,?,?)",req.body.user_name, req.body.title, req.body.topic , req.body.topic_id , req.body.content , req.body.last_updated , req.body.votes , function(err){
		if(err){
        	console.log(err);
      	} else {
        	console.log("sucess!");
        	res.redirect("/");
      	}
	}); 
});

app.get("/forums", function (req,res){
		// db.all("SELECT * FROM forums", function (err,rows){
	db.all("SELECT forums.id, forums.user_id , forums.title , forums.topic , forums.topic_id , forums.content , forums.last_updated, forums.votes , forums.created_on, count(comments.id) as total_comments FROM comments LEFT JOIN forums WHERE comments.forum_id = forums.id GROUP BY forums.id ORDER BY count(comments.id) DESC;", function (err,rows){
	 if(err){
        console.log(err);
      } else {
      	var all_forums = rows;
      	// console.log(all_forums.total_comments);
  //     	all_forums.forEach(function (el){
  //     		console.log(el.id);
  //     		db.all('SELECT count(id) FROM comments WHERE forum_id=? ORDER BY votes DESC', el.id, function (err,rows){
		// 		app.use(express.static('public'));
		// 		var comments = rows;
		// 		// console.log(all_forums);
		// 		console.log(comments);
        		var html = fs.readFileSync("./views/show.html.ejs", "utf8"); 
        		var rendered = ejs.render(html, {posts: all_forums});
        		res.send(rendered);	
		// 	});	
		// });	
      }
	});
});


app.put("/forums", function (req,res){
	console.log(req.body);
	db.run("UPDATE forums SET votes=? WHERE id=?", parseInt(req.body.current_vote)+parseInt(req.body.vote), req.body.forum ,function (err){
		if(err){
        	console.log(err);
      	} else {
        	console.log("sucess2!");
        	res.redirect("/forums/"+req.body.forum);
      	}
	});
});

app.get("/forums/:id", function (req,res){
	console.log(req.params);
	db.get("SELECT * FROM forums WHERE id=?", req.params.id, function (err,row){
		if (err){
			console.log(err);
		} else {
			var post = row;
			db.all('SELECT * FROM comments WHERE forum_id=? ORDER BY votes DESC',req.params.id, function (err,rows){
					app.use(express.static('public'));
					var comments = rows;
					var template = fs.readFileSync("./views/showpost.html.ejs",'utf8');
					var html = ejs.render(template,{post:post, comments:comments});
					res.send(html);
				});	
		}
	});
});


app.post("/forums/:id",function (req,res){
	console.log(req.body);
	db.run("INSERT INTO comments(content,votes,creator,forum_id) VALUES (?,?,?,?)",req.body.comment,"0", req.body.user_name, req.body.forum_id, function(err){
		if(err){
        	console.log(err);
      	} else {
        	console.log("sucess!");
        	res.redirect("/forums/"+req.body.forum_id);
      	}
	}); 
});


app.put("/forums/:id", function (req,res){
	console.log(req.body);
	db.run("UPDATE forums SET votes=? WHERE id=?", parseInt(req.body.current_vote)+parseInt(req.body.vote), req.body.forum ,function (err){
		if(err){
        	console.log(err);
      	} else {
        	console.log("sucess2!");
        	res.redirect("/forums/"+req.body.forum);
      	}
	});
});


app.put("/forums/:id/comments", function (req,res){
	console.log(req.body);
	db.run("UPDATE comments SET votes=? WHERE id=?", parseInt(req.body.current_vote)+parseInt(req.body.vote), req.body.comment ,function (err){
		if(err){
        	console.log(err);
      	} else {
        	console.log("sucess!");
        	res.redirect("/forums/"+req.body.forum+"#"+req.body.comment);
      	}
	});
});


app.get("/playlist", function (req,res){
  console.log(req.params.id);
  app.use(express.static('public'));
    var html = fs.readFileSync("./views/music.html.ejs","utf8");
    var rendered = ejs.render(html,{tracks:data});
    res.send(rendered);
})



var data = [{attributes:"left: 0; top: 0; width: 280px; height: 280px;",id:"16a_1"},
{attributes:"left: 280px; top: 0px; width: 200px; height: 200px;",id:"16a_2"},
{attributes:"left: 280px; top: 200px; width: 80px; height: 80px;",id:"16a_3"},
{attributes:"left: 360px; top: 200px; width: 120px; height: 120px;",id:"16a_4"},
{attributes:"left: 0px; top: 280px; width: 200px; height: 200px;",id:"16a_5"},
{attributes:"left: 200px; top: 280px; width: 70px; height: 70px;",id:"16a_6"},
{attributes:"left: 270px; top: 280px; width: 90px; height: 90px;",id:"16a_7"},
{attributes:"left: 360px; top: 320px; width: 50px; height: 50px;",id:"16a_8"},
{attributes:"left: 410px; top: 320px; width: 70px; height: 70px;",id:"16a_9"},
{attributes:"left: 200px; top: 350px; width: 50px; height: 50px;",id:"16a_10"},
{attributes:"left: 250px; top: 350px; width: 20px; height: 20px;",id:"16a_11"},
{attributes:"left: 250px; top: 370px; width: 30px; height: 30px;",id:"16a_12"},
{attributes:"left: 280px; top: 370px; width: 110px; height: 110px;",id:"16a_13"},
{attributes:"left: 390px; top: 370px; width: 20px; height: 20px;",id:"16a_14"},
{attributes:"left: 390px; top: 390px; width: 90px; height: 90px;",id:"16a_15"},
{attributes:"left: 200px; top: 400px; width: 80px; height: 80px;",id:"16a_16"}];


