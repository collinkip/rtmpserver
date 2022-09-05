const express = require('express'),
    Session = require('express-session'),
    bodyParse = require('body-parser'),
    mongoose = require('mongoose'),
    middleware = require('connect-ensure-login'),
    FileStore = require('session-file-store')(Session),
    config = require('./config/default'),
    flash = require('connect-flash'),
    port = 3333,
    app = express();
 
mongoose.connect('mongodb://127.0.0.1/nodeStream' , { useNewUrlParser: true });
const node_media_server = require('./media_server');
// Add on the top next to imports
const passport = require('./auth/passport');
const path = require('path');
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));


// Register app routes
 
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));

app.use(flash());
app.use(require('cookie-parser')());
app.use(bodyParse.urlencoded({extended: true}));
app.use(bodyParse.json({extended: true}));
 
app.use(Session({
    store: new FileStore({
        path : './server/sessions'
    }),
    secret: config.server.secret,
    maxAge : Date().now + (60 * 1000 * 30)
}));
 
app.get('*', middleware.ensureLoggedIn(), (req, res) => {
    res.render('index');
});

// Add this on the top of app.js file
// next to all imports

 
// and call run() method at the end
// file where we start our web server
 

 
app.listen(port, () => console.log(`App listening on ${port}!`));
node_media_server.run();