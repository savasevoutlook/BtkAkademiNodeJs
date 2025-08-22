const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
//const cookieParser = require('cookie-parser');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const accountRoutes = require('./routes/account');
const errorController = require('./controllers/errors');
const User = require('./models/user');
const ConnectionString = 'mongodb://localhost:27017/node-app';


app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

var store = new MongoDBStore({
  uri: ConnectionString,
  collection: 'mySessions'
});

store.on('error', function(error) {
  console.log(error);
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findOne({ email: 'savas.ev@example.com' })
        .then(user => {
            if (user) {
                req.user = user;
                next();
            }
        })
        .catch(err => { console.log(err); });
});

const mongoose = require('mongoose');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(accountRoutes);
app.use(errorController.get404Page);

mongoose.connect(ConnectionString)
    .then(() => {
        console.log('connected to MongoDB');

        User.findOne({ email: 'savas.ev@example.com' })
            .then(user => {
                if (!user) {
                    user = new User({
                        username: 'savas.ev',
                        email: 'savas.ev@example.com'
                    });
                    return user.save();
                }
                return user;
            })
            .catch(err => {
                console.log(err);
            });

        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });