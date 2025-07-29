const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./utility/database');

const Product = require('./models/product');
const Category = require('./models/category');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const shopRoutes = require('./routes/shop');
app.use(shopRoutes);

const errorController = require('./controllers/errors');
app.use(errorController.get404Page);

Product.belongsTo(Category);
//Category.hasMany(Product);
//Product.hasOne(Category);

sequelize.sync({ force: true })
    .then(result => {
        //console.log(result);
    })
    .catch(err => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
