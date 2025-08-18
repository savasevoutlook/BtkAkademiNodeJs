const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');
const User = require('./models/user');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findOne({ email: 'savas.ev@example.com' })
        .then(user => {
            if (user) {
                req.user = user;
                console.log(user);
                next();
            }
        })
        .catch(err => { console.log(err); });
});

const mongoose = require('mongoose');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);

mongoose.connect('mongodb://localhost:27017/node-app')
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