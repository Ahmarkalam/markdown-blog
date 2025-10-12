const express = require('express');
const loki = require('lokijs');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const app = express();
const port = 3000;

// Setup for sanitizing HTML to prevent security vulnerabilities
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// --- Database Setup ---
const db = new loki('posts.db', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true, 
    autosaveInterval: 4000
});

// This function runs once the database is loaded to ensure the 'posts' collection exists
function databaseInitialize() {
  let posts = db.getCollection("posts");
  if (posts === null) {
    posts = db.addCollection("posts");
  }
}

// --- Helper Function ---
// Calculates the estimated read time for a block of text
function calculateReadTime(text) {
    const wordsPerMinute = 200; // Average reading speed
    const words = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / wordsPerMinute);
    return `${readTime} min read`; // Returns a formatted string
}

// --- Middleware ---
app.set('view engine', 'ejs');
app.use(express.static('public')); // Serves static files from 'public' folder
app.use(express.urlencoded({ extended: true })); // Parses form data

// --- Routes ---

// READ all posts OR handle search results
app.get('/', (req, res) => {
    const postsCollection = db.getCollection("posts");
    let posts = postsCollection.chain().simplesort('$created', true).data();
    let pageTitle = "All Posts";

    // Search functionality
    if (req.query.search && req.query.search.trim() !== '') {
        const searchTerm = req.query.search.toLowerCase();
        posts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.content.toLowerCase().includes(searchTerm)
        );
        pageTitle = `Search Results for "${req.query.search}"`;
    }
    
    res.render('index', { posts: posts, pageTitle: pageTitle, query: req.query.search });
});

// Show the form to CREATE a new post
app.get('/new', (req, res) => {
    res.render('new', { pageTitle: "New Post" });
});

// CREATE a new post (handle form submission)
app.post('/new', (req, res) => {
    const postsCollection = db.getCollection("posts");
    const { title, author, content } = req.body;

    if (title && author && content) {
        const readTime = calculateReadTime(content);
        postsCollection.insert({
            title, author, content, readTime,
            createdAt: new Date().toLocaleDateString()
        });
        res.redirect('/');
    } else {
        res.render('new', { error: "All fields are required.", pageTitle: "New Post" });
    }
});

// READ a single, specific post
app.get('/post/:id', (req, res) => {
    const postsCollection = db.getCollection("posts");
    const id = parseInt(req.params.id);
    const post = postsCollection.get(id);

    if (post) {
        const sanitizedHtml = DOMPurify.sanitize(marked.parse(post.content));
        res.render('post', { post, sanitizedHtml, pageTitle: post.title });
    } else {
        res.status(404).send('Post not found');
    }
});

// Show the form to UPDATE (edit) a post
app.get('/edit/:id', (req, res) => {
    const postsCollection = db.getCollection("posts");
    const post = postsCollection.get(parseInt(req.params.id));
    if (post) {
        res.render('edit', { post, pageTitle: "Edit Post" });
    } else {
        res.redirect('/');
    }
});

// UPDATE a post (handle form submission from edit page)
app.post('/edit/:id', (req, res) => {
    const postsCollection = db.getCollection("posts");
    const id = parseInt(req.params.id);
    const post = postsCollection.get(id);
    const { title, author, content } = req.body;

    if (post) {
        post.title = title;
        post.author = author;
        post.content = content;
        post.readTime = calculateReadTime(content); // Recalculate read time
        postsCollection.update(post);
        res.redirect(`/post/${id}`); // Redirect to the updated post view
    } else {
        res.redirect('/');
    }
});

// DELETE a post
app.post('/post/delete/:id', (req, res) => {
    const postsCollection = db.getCollection("posts");
    postsCollection.remove(parseInt(req.params.id));
    res.redirect('/');
});

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Blog app is running at http://localhost:${port}`);
});