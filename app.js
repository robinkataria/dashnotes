const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeStartingContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At varius vel pharetra vel turpis nunc eget lorem. Cursus metus aliquam eleifend mi in. Ac auctor augue mauris augue neque gravida in. Sit amet mattis vulputate enim nulla aliquet porttitor. Fringilla ut morbi tincidunt augue interdum. Est velit egestas dui id ornare arcu odio. Tellus rutrum tellus pellentesque eu. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Tellus orci ac auctor augue mauris augue neque. Consectetur adipiscing elit duis tristique. Sit amet nisl suscipit adipiscing bibendum. Ultrices neque ornare aenean euismod elementum nisi quis. Dui id ornare arcu odio ut sem. Sed elementum tempus egestas sed sed risus pretium. Justo laoreet sit amet cursus sit.";
const aboutContent =
    "Ipsum augue eget arcu dictum varius duis at consectetur lorem. Justo donec enim diam vulputate ut. At auctor urna nunc id cursus metus. Viverra orci sagittis eu volutpat odio facilisis mauris sit. In ornare quam viverra orci. Purus sit amet volutpat consequat. Diam quis enim lobortis scelerisque fermentum dui faucibus in. Eget nulla facilisi etiam dignissim diam quis enim lobortis. Quis ipsum suspendisse ultrices gravida dictum. Aenean et tortor at risus viverra adipiscing at in tellus. Sed risus ultricies tristique nulla aliquet enim tortor at auctor. Mi bibendum neque egestas congue quisque egestas diam. Ullamcorper morbi tincidunt ornare massa. Libero nunc consequat interdum varius sit amet mattis vulputate. Donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Duis at consectetur lorem donec massa sapien faucibus et molestie. Tristique senectus et netus et malesuada.";
const contactContent =
    "Fusce ut placerat orci nulla pellentesque dignissim enim. Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Eget duis at tellus at. Urna neque viverra justo nec ultrices dui sapien eget mi. Luctus accumsan tortor posuere ac ut consequat semper. Vitae turpis massa sed elementum tempus egestas. Amet risus nullam eget felis eget. Luctus accumsan tortor posuere ac ut consequat semper viverra. Eget nulla facilisi etiam dignissim diam. Justo eget magna fermentum iaculis eu. Hac habitasse platea dictumst quisque sagittis purus sit amet. Augue ut lectus arcu bibendum at varius vel pharetra vel. Integer enim neque volutpat ac tincidunt vitae. Ut pharetra sit amet aliquam id diam. Enim nec dui nunc mattis enim ut.";
let posts = [];

// --------- mongoDB ----------

// "mongodb://localhost:27017/blogDB"
mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@projectsdb-xdyx3.mongodb.net/blogDB`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Post = mongoose.model("Post", postSchema);

// --------- Routes -----------

app.get("/", (req, res) => {
    Post.find((err, posts) => {
        if (err) return handleError(err);
        else {
            res.render("home", { startingContent: homeStartingContent, posts: posts });
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about", { content: aboutContent });
});

app.get("/contact", (req, res) => {
    res.render("contact", { content: contactContent });
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.get("/posts/:postid", (req, res) => {
    Post.findOne({ _id: req.params.postid }, (err, post) => {
        res.render("post", { content: post });
    });
});

app.post("/compose", (req, res) => {
    const newPost = new Post({
        title: req.body.postTitle,
        content: req.body.postBody,
    });

    // newPost.save();
    Post.create(newPost, (err, newPost) => {
        if (err) return handleError(err);
        else {
            res.redirect("/");
        }
    });
});

// ---------Listen-------------

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server has started successfully!");
});
