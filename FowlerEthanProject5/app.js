//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');


//create app
const app = express();

//app configuration
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
const mongoUri = 'mongodb+srv://admin:admin123@cluster0.ysefp.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0';
//'mongodb+srv://admin:admin123@cluster0.ysefp.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0';

//connect to MongoDB
mongoose.connect(mongoUri)
.then(()=>{
    //start server
    app.listen(port, host, () =>{
        console.log('Server is running on port ' + port);
    });
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'fdgfhkjdfgqwezcxbmqzw',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 3600000},
    store: new MongoStore({mongoUrl: 'mongodb+srv://admin:admin123@cluster0.ysefp.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0'})
}))

app.use(flash());

app.use((req, res, next)=>{
    res.locals.user = req.session.user || null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})

//set up routes
app.get('/', (req, res) =>{
    res.render('index');
})

app.use('/games', gameRoutes);

app.use('/users', userRoutes);

//set up error handling
app.use((req, res, next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status)
    {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
})


