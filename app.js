const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./utility/database');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const shopRoutes = require('./routes/shop');
app.use(shopRoutes);

connection.execute('SELECT * FROM products')
    .then((result) => {
        console.log(result);
    })
    .catch(err => {
        console.error(err);
    });

const errorController = require('./controllers/errors');
app.use(errorController.get404Page);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
