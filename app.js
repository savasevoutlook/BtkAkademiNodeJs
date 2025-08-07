const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const shopRoutes = require('./routes/shop');
app.use(shopRoutes);

const errorController = require('./controllers/errors');
app.use(errorController.get404Page);

const mongoConnect = require('./utility/database').mongoConnect;

mongoConnect((client) => {
    app.listen(3000);
    //console.log(client);
});
