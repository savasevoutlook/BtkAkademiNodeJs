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

Product.belongsTo(Category, { foreignKey: { allowNull: false } });
//Category.hasMany(Product);
//Product.hasOne(Category);

sequelize.sync()
    //.sync({ force: true })
    .then(() => {
        Category.count()
            .then(count => {
                if (count === 0) {
                    Category.bulkCreate([
                        { name: 'İşlemci (CPU)', description: 'Bilgisayarın temel hesaplama gücünü sağlayan birim.' },
                        { name: 'Anakart (Motherboard)', description: 'Tüm donanım bileşenlerini birbirine bağlayan ana bileşen.' },
                        { name: 'Ekran Kartı (GPU)', description: 'Grafik işlemlerini gerçekleştiren, oyun ve profesyonel işler için olmazsa olmaz bileşen.' },
                        { name: 'RAM (Bellek)', description: 'Geçici veri depolama birimi, sistemin hızını doğrudan etkiler.' },
                        { name: 'Depolama (SSD/HDD)', description: 'Verilerin kalıcı olarak saklandığı disk birimleri.' },
                        { name: 'Kasa (Case)', description: 'Donanım bileşenlerini barındıran fiziksel yapı.' },
                        { name: 'Güç Kaynağı (PSU)', description: 'Tüm donanımlara elektrik sağlayan güç birimi.' },
                        { name: 'İşlemci Soğutucusu (CPU Cooler)', description: 'İşlemcinin ısısını düşüren hava veya sıvı soğutucular.' },
                        { name: 'Ekran Kartı Soğutucusu', description: 'Özellikle overclock için GPU soğutma çözümleri.' },
                        { name: 'Kasa Fanı', description: 'Kasada hava sirkülasyonunu sağlayan fanlar.' },
                        { name: 'RGB Fan / Aydınlatma', description: 'Estetik görünüm için kullanılan LED’li fan ve şerit aydınlatmalar.' },
                        { name: 'Monitör', description: 'Bilgisayarın görsel çıktısını sunan ekran birimi.' },
                        { name: 'Klavye', description: 'Giriş birimi, mekanik ve membran seçenekleriyle.' },
                        { name: 'Mouse', description: 'İmleç kontrolü sağlayan giriş birimi.' },
                        { name: 'Kulaklık / Hoparlör', description: 'Ses çıkışı sağlayan çevresel donanım birimleri.' },
                        { name: 'Termal Macun', description: 'İşlemci ve soğutucu arasında ısı iletimi sağlayan malzeme.' },
                        { name: 'M.2 SSD', description: 'Yeni nesil yüksek hızlı depolama birimi.' },
                        { name: 'Wi-Fi / Bluetooth Kartı', description: 'Kablosuz bağlantı için gerekli ek kartlar.' },
                        { name: 'Optik Sürücü (DVD/CD)', description: 'Disk okuma-yazma birimi (artık isteğe bağlı).' },
                        { name: 'Yedek Parçalar / Aksesuarlar', description: 'Kablo, adaptör, vida setleri gibi ek parçalar.' },
                        { name: 'İşlemci Termal Çözümleri', description: 'Custom loop sıvı soğutma, fan setleri vs.' },
                        { name: 'Overclock Aksesuarları', description: 'Performans arttırma için özel ekipmanlar.' },
                        { name: 'UPS / Güç Koruma', description: 'Elektrik kesintilerine karşı koruma sağlayan cihazlar.' },
                        { name: 'Montaj Hizmeti', description: 'Toplama ve test işlemlerini kapsayan hizmet kategorisi.' },
                    ]);
                }
            });
    })
    .catch(err => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
