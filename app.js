const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
//const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');
//const User = require('./models/user');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findByEmail('savas.ev@example.com')
//         .then(user => {
//             if (user) {
//                 req.user = new User(user.name, user.email, user.cart, user._id);
//                 next();
//             }
//         })
//         .catch(err => { console.log(err); });
// });

const mongoose = require('mongoose');

app.use('/admin', adminRoutes);
//app.use(shopRoutes);
app.use(errorController.get404Page);

// mongoConnect((client) => {
//     User.findByEmail('savas.ev@example.com')
//         .then(user => {
//             if (!user) {
//                 user = new User('savas.ev', 'savas.ev@example.com');
//                 return user.save();
//             }

//             return user;
//         })
//         .then(() => {
//             app.listen(3000);
//         })
//         .catch(err => { console.log(err); });
// });

mongoose.connect('mongodb://localhost:27017/node-app')
    .then(() => {
        console.log('connected to MongoDB');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });