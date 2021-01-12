const express = require('express');  // import express
const morgan = require('morgan');  // import middleware morgan
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();  // express app

// connect to mongodb
const dbURI = 'mongodb+srv://netninja:Budda800@nodetuts.3ierq.mongodb.net/nodetuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3005))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs'); // registers the view engine

// listen for requests
//app.listen(3005);


// demonstrates what happens with the app.use method and how it loads from top to bottom (needs "next" to avoid interrupting code)
// app.use((req, res, next) => {
//     console.log('new request was made');
//     console.log('host: ', req.hostname);
//     console.log('path: ', req.path);
//     console.log('method: ', req.method);
//     next();
// });


// middleware and static files
app.use(express.static('public'));
app.use(morgan('dev'));

// mongoose and mongo sandbox routes 
// app.get('/add-blog', (req, res) => {  // the following code gives us a new object, stored in the cloud at mongodb:Atlas
//     const blog = new Blog({
//         title: 'new blog 2',
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     });

//     blog.save()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

// app.get('/all-blogs', (req, res) => {  // gets all blogs together
//     Blog.find()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

// app.get('/single-blog', (req, res) => {
//     Blog.findById("5ffcd2a2f038e90bbcea4bdf")
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });



app.get('/', (req, res) => {  //  the following code renders our homepage!
    // pass in an array of objects that represent each blog: with a title and snippet

    res.redirect('/blogs');

    // * we replaced the following code by placing it in the (/blogs) function below and instead redirecting here (above)...
//     const blogs = [
//         {title: 'Time to make a change!', snippet: 'Giving up my dream of becoming a restauranteur...'},
//         {title: 'Surveying the landscape.', snippet: 'Why I chose Kingsland University...'},
//         {title: 'Packing my chute and boarding the plane.', snippet: 'It feels like day one of high school; am I going to survive?'}
//     ];

//     // res.send('<p>Home Page</p>');  // this was the first method, upgraded to the line below
//     // res.sendFile('./views/index.html', { root: __dirname });  // this was the second method, obsolete from EJS and the line below
//     res.render('index', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {  // this function renders the about page!
    //res.send('<p>About Page</p>');  // this was the first method, upgraded to the line below
    // res.sendFile('./views/about.html', { root: __dirname });  // as above this line was abondened so we may render instead
    res.render('about', { title: 'About' });
});

// redirects   ** quieted after installing EJS and not really needing it anymore
// app.get('/about-us', (req, res) => {
//     res.redirect('/about');
// });

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        });
});


// loads createBlogs page
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
    // res.status(404).sendFile('./views/404.html', { root: __dirname });  // this line was abondened so we may render instead
    res.status(404).render('404', { title: 404 });
});