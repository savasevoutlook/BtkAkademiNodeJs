require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const accountRoutes = require('./routes/account');
const errorRoutes = require('./routes/error');
const errorController = require('./controllers/errors');

const User = require('./models/user');
const ConnectionString = 'mongodb://localhost:27017/node-app';
const isAdmin = require('./middleware/is-admin');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));

var store = new MongoDBStore({
    uri: ConnectionString,
    collection: 'mySessions'
});

store.on('error', function(error) {
    console.log(error);
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store
}));

// Cookie parser
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            }
        })
        .catch(err => { console.log(err); });
});

const mongoose = require('mongoose');

app.use('/admin', isAdmin, adminRoutes);
app.use(shopRoutes);
app.use(accountRoutes);
app.use(errorRoutes);

app.use('/500', errorController.get500Page)
app.use(errorController.get404Page);

mongoose.connect(ConnectionString)
    .then(() => {
        console.log('connected to MongoDB');
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    });
    