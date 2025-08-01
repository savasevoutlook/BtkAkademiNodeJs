const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./utility/database');

const Product = require('./models/product');
const Category = require('./models/category');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findOne({ where: { email: 'savas.ev@example.com' } })
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const shopRoutes = require('./routes/shop');
app.use(shopRoutes);

const errorController = require('./controllers/errors');

app.use(errorController.get404Page);

Product.belongsTo(Category, { foreignKey: { allowNull: false } });
Category.hasMany(Product);

Product.belongsTo(User);
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product,  { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize.sync()
    .then(() => {
        User.findOne({ where: { email: 'savas.ev@example.com' } })
            .then(user => {
                if (!user) {
                    return User.create({
                        name: 'savas.ev',
                        email: 'savas.ev@example.com'
                    });
                }

                return user;
            })
            .then(user => {

                Category.count().then(count => {
                    if (count === 0) {

                        const categories = [
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
                            { name: 'Termal Macun', description: 'İşlemci ve soğutucu arasında ısı iletimi sağlayan malzeme.' },
                            { name: 'M.2 SSD', description: 'Yeni nesil yüksek hızlı depolama birimi.' },
                            { name: 'Optik Sürücü (DVD/CD)', description: 'Disk okuma-yazma birimi (artık isteğe bağlı).' },
                        ];

                        Category.bulkCreate(categories);
                    }
                });

                Product.count().then(count => {
                    if (count === 0) {

                        var products = [

                            // CPU (categoryId:1)
                            { name: 'Intel Core i7‑13700K', price: 16200, image: 'product1.jpg', description: 'Intel 13. nesil 16‑çekirdekli üst seviye CPU', categoryId: 1 },
                            { name: 'Intel Core i7‑13700KF', price: 15300, image: 'product2.jpg', description: 'Kutulu olmayan, overclock destekli i7‑KF', categoryId: 1 },
                            { name: 'Intel Core i5‑14400F', price: 8200, image: 'product3.jpg', description: 'Fiyat‑performans odaklı 10 çekirdekli CPU', categoryId: 1 },
                            { name: 'AMD Ryzen 7 7800X3D', price: 15800, image: 'product4.jpg', description: 'Oyun performansında öne çıkan X3D CPU', categoryId: 1 },
                            { name: 'AMD Ryzen 5 7600', price: 7000, image: 'product5.jpg', description: 'Orta segment Ryzen işlemci', categoryId: 1 },

                            // Motherboard (categoryId:2)
                            { name: 'Asus Prime B760M‑R D4', price: 4100, image: 'product6.jpg', description: 'DDR4 soketli mikro‑ATX B760 anakart', categoryId: 2 },
                            { name: 'MSI MAG Z790 Tomahawk WiFi', price: 8500, image: 'product7.jpg', description: 'Intel Z790 yonga setli orta‑üst seviye ATX mobo', categoryId: 2 },
                            { name: 'ASRock B760M PG Sonic WiFi', price: 3900, image: 'product8.jpg', description: 'B760, Wi‑Fi destekli bütçe dostu anakart', categoryId: 2 },
                            { name: 'Asus ROG Maximus Z890 Hero', price: 28100, image: 'product9.jpg', description: 'LGA1851 için üst düzey ROG anakart', categoryId: 2 },
                            { name: 'Asus ROG Strix X870‑I Gaming WiFi', price: 9100, image: 'product10.jpg', description: 'AM5 Mini‑ITX Wi‑Fi7 ve PCIe5 destekli mobo', categoryId: 2 },

                            // GPU (categoryId:3)
                            { name: 'NVIDIA GeForce RTX 4070 Ti', price: 28500, image: 'product11.jpg', description: 'Yüksek FPS oyun kartı', categoryId: 3 },
                            { name: 'NVIDIA RTX 4060 Ti', price: 21000, image: 'product12.jpg', description: '1440p çok iyi performans sunan GPU', categoryId: 3 },
                            { name: 'AMD Radeon RX 7800 XT', price: 22000, image: 'product13.jpg', description: 'AMD tarafında 1440p rekabetçi kart', categoryId: 3 },
                            { name: 'NVIDIA GeForce RTX 4060', price: 18000, image: 'product14.jpg', description: '1080p oyunlar için ideal GPU', categoryId: 3 },
                            { name: 'AMD Radeon RX 7900 XTX', price: 35000, image: 'product15.jpg', description: '4K performans üst seviye kart', categoryId: 3 },

                            // RAM (categoryId:4)
                            { name: 'Corsair Vengeance DDR5 32GB (6000MHz)', price: 4200, image: 'product16.jpg', description: 'Hızlı DDR5 RAM kiti', categoryId: 4 },
                            { name: 'G.Skill Trident Z5 32GB (6000MHz)', price: 4400, image: 'product17.jpg', description: 'Oyuncular için RGB DDR5 RAM', categoryId: 4 },
                            { name: 'Kingston Fury Beast DDR5 32GB (5600MHz)', price: 4000, image: 'product18.jpg', description: 'Güvenilir DDR5 RAM', categoryId: 4 },
                            { name: 'Corsair Vengeance LPX DDR4 16GB (3200MHz)', price: 1900, image: 'product19.jpg', description: 'DDR4 ekonomi RAM kiti', categoryId: 4 },
                            { name: 'Patriot Viper Steel DDR5 32GB (6400MHz)', price: 4600, image: 'product20.jpg', description: 'Yüksek saat hızlı RAM', categoryId: 4 },

                            // SSD/HDD (categoryId:5)
                            { name: 'Samsung 980 Pro 1TB', price: 3500, image: 'product21.jpg', description: 'PCIe 4.0 M.2 SSD', categoryId: 5 },
                            { name: 'Samsung 990 Evo Plus 1TB', price: 4599, image: 'product22.jpg', description: 'PCIe 4.0 yüksek hızlı SSD', categoryId: 5 },
                            { name: 'Western Digital Black SN850X 1TB', price: 4200, image: 'product23.jpg', description: 'Gamer SSD yüksek performans', categoryId: 5 },
                            { name: 'Crucial P5 Plus 2TB', price: 3700, image: 'product24.jpg', description: 'Uygun fiyatlı NVMe SSD', categoryId: 5 },
                            { name: 'Kingston NV2 M.2 1TB', price: 2800, image: 'product25.jpg', description: 'Ekonomik M.2 SSD', categoryId: 5 },

                            // Case (categoryId:6)
                            { name: 'MSI MAG Forge 320R Airflow', price: 4266, image: 'product121.jpg', description: '4×120 mm ARGB fanlı mid‑tower kasa', categoryId: 6 },
                            { name: 'MSI MAG Pano M100R PZ White', price: 4624, image: 'product122.jpg', description: '3×120 mm ARGB fan, temperli cam matx kasa', categoryId: 6 },
                            { name: 'Corsair 3000D RGB', price: 2793, image: 'product123.jpg', description: 'Airflow RGB kabin, geniş iç hacim', categoryId: 6 },
                            { name: 'Fractal Design Meshify 2 Compact', price: 24200, image: 'product124.jpg', description: 'Mesh panel, sessiz ve yüksek hava akışlı kasa', categoryId: 6 },
                            { name: 'Revenge Nova 3 ARGB', price: 1816, image: 'product125.jpg', description: '3×ARGB fanlı uygun fiyatlı gaming kasa', categoryId: 6 },

                            // CPU Cooler (categoryId:8)
                            { name: 'Cooler Master Hyper 212 Halo Black', price: 2167, image: 'product101.jpg', description: 'Intel 1700/1851/AM5 uyumlu hava soğutucu 120 mm fan', categoryId: 8 },
                            { name: 'Cooler Master Hyper 212 Spectrum V3', price: 1797, image: 'product102.jpg', description: 'ARGB fanlı değer odaklı CPU soğutucu', categoryId: 8 },
                            { name: 'Cooler Master Hyper 622 Halo White', price: 3194, image: 'product103.jpg', description: 'Çift fanlı güçlü kule soğutucu', categoryId: 8 },
                            { name: 'DeepCool AK400 Digital Pro ARGB', price: 2225, image: 'product104.jpg', description: '140mm PWM fanlı ARGB CPU hava soğutucu', categoryId: 8 },
                            { name: 'DeepCool AS500 A‑RGB', price: 2692, image: 'product105.jpg', description: 'Büyük kuleli yüksek performanslı soğutucu', categoryId: 8 },

                            // GPU Cooler (categoryId:9)
                            { name: 'ARCTIC Accelero Xtreme IV', price: 1200, image: 'product106.jpg', description: 'Özel VGA soğutucu, overclock için ideal', categoryId: 9 },
                            { name: 'NZXT Kraken G12 + RL AIO', price: 14000, image: 'product107.jpg', description: 'GPU için sıvı soğutma adaptörü', categoryId: 9 },
                            { name: 'Thermalright Shaman 120 SE', price: 3500, image: 'product108.jpg', description: '12 cm fanlı pasif destekli GPU soğutucu', categoryId: 9 },
                            { name: 'Gelid Solutions Icy Vision', price: 2000, image: 'product109.jpg', description: 'Pasif + fanlı çoklu GPU soğutucu', categoryId: 9 },
                            { name: 'Raijintek Iris 12a', price: 900, image: 'product110.jpg', description: 'Ekstra fanlı GPU soğutma bracket', categoryId: 9 },

                            // Case Fan (categoryId:10)
                            { name: 'Corsair AF120 120 mm Fan', price: 250, image: 'product111.jpg', description: 'Yüksek hava akışlı kasa fanı', categoryId: 10 },
                            { name: 'Noctua NF‑P12 redux‑1700 PWM', price: 350, image: 'product112.jpg', description: 'Sessiz ve verimli kasa fanı', categoryId: 10 },
                            { name: 'Arctic P12 PWM PST', price: 300, image: 'product113.jpg', description: 'Ekonomik ama güçlü fan', categoryId: 10 },
                            { name: 'Cooler Master SickleFlow 120 ARGB', price: 400, image: 'product114.jpg', description: 'RGB aydınlatmalı kasa fanı', categoryId: 10 },
                            { name: 'Thermaltake Riing 12 RGB', price: 600, image: 'product115.jpg', description: 'ARGB fan şeritli set', categoryId: 10 },

                            // RGB Fan / Aydınlatma (categoryId:11)
                            { name: 'DeepCool RGB LED Strip', price: 400, image: 'product116.jpg', description: 'Çeşitli renkte LED şerit aydınlatma', categoryId: 11 },
                            { name: 'Corsair iCUE Lighting Node PRO', price: 900, image: 'product117.jpg', description: 'Tüm RGB cihazlarını senkronize eden kontrol ünitesi', categoryId: 11 },
                            { name: 'Phanteks NEON Digital-RGB Kit', price: 550, image: 'product118.jpg', description: 'Dinamik RGB şerit kiti', categoryId: 11 },
                            { name: 'NZXT Hue 2 RGB Lighting Kit', price: 800, image: 'product119.jpg', description: 'RGB kontrol yazılım destekli kit', categoryId: 11 },
                            { name: 'Lian Li Strimer Plus ARGB Cable', price: 650, image: 'product120.jpg', description: 'ARGB kablo ve güç aydınlatma modülü', categoryId: 11 },
                        ]

                        const userId = user.id;

                        const productsWithUser = products.map(p => ({ ...p, userId }));

                        Product.bulkCreate(productsWithUser);
                    }
                });

            })
            .catch(err => {
                console.error('Hata:', err);
            });
    })
    .catch(err => {
        console.log(err);
    });

app.listen(3000, () => {
    //console.log('Server is running on port 3000');
});
