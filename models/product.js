const products = [
    { id: '54690', name: 'Ürün 1', price: 100, image: 'product1.jpg', description: 'Bu ürün yüksek kaliteli bir üründür.', categoryId: '3' },
    { id: '54691', name: 'Ürün 2', price: 200, image: 'product2.jpg', description: 'Bu ürün dayanıklı ve uzun ömürlüdür.', categoryId: '18' },
    { id: '54692', name: 'Ürün 3', price: 300, image: 'product3.jpg', description: 'Bu ürün modern tasarıma sahiptir.', categoryId: '14' },
    { id: '54693', name: 'Ürün 4', price: 150, image: 'product4.jpg', description: 'Bu ürün uygun fiyatlı ve kullanışlıdır.', categoryId: '10' },
    { id: '54694', name: 'Ürün 5', price: 26500, image: 'product5.jpg', description: 'Bu ürün yüksek performans sunar.', categoryId: '1' },
    { id: '54695', name: 'Ürün 6', price: 14400, image: 'product6.jpg', description: 'Bu ürün şık ve estetik bir görünüme sahiptir.', categoryId: '6' },
    { id: '54696', name: 'Ürün 7', price: 26500, image: 'product7.jpg', description: 'Bu ürün enerji verimliliği ile dikkat çeker.', categoryId: '4' },
    { id: '54697', name: 'Ürün 8', price: 18700, image: 'product8.jpg', description: 'Bu ürün kullanıcı dostu bir tasarıma sahiptir.', categoryId: '16' },
    { id: '54698', name: 'Ürün 9', price: 32000, image: 'product9.jpg', description: 'Bu ürün yüksek teknoloji ile üretilmiştir.', categoryId: '2' },
    { id: '54699', name: 'Ürün 10', price: 45000, image: 'product10.jpg', description: 'Bu ürün lüks ve konfor sunar.', categoryId: '5' },
    { id: '54700', name: 'Ürün 11', price: 12000, image: 'product11.jpg', description: 'Bu ürün hafif ve taşınabilir bir yapıya sahiptir.', categoryId: '7' },
    { id: '54701', name: 'Ürün 12', price: 9800, image: 'product12.jpg', description: 'Bu ürün çevre dostu malzemelerden üretilmiştir.', categoryId: '9' },
    { id: '54702', name: 'Ürün 13', price: 22000, image: 'product13.jpg', description: 'Bu ürün yüksek kaliteli malzemelerden üretilmiştir.', categoryId: '12' },
    { id: '54703', name: 'Ürün 14', price: 17500, image: 'product14.jpg', description: 'Bu ürün ergonomik bir tasarıma sahiptir.', categoryId: '8' },
    { id: '54704', name: 'Ürün 15', price: 30000, image: 'product15.jpg', description: 'Bu ürün profesyonel kullanım için idealdir.', categoryId: '11' },
    { id: '54705', name: 'Ürün 16', price: 40000, image: 'product16.jpg', description: 'Bu ürün yüksek hız ve performans sunar.', categoryId: '15' },
    { id: '54706', name: 'Ürün 17', price: 15000, image: 'product17.jpg', description: 'Bu ürün uzun ömürlü ve dayanıklıdır.', categoryId: '13' },
    { id: '54707', name: 'Ürün 18', price: 18000, image: 'product18.jpg', description: 'Bu ürün şık ve modern bir tasarıma sahiptir.', categoryId: '17' },
    { id: '54708', name: 'Ürün 19', price: 23000, image: 'product19.jpg', description: 'Bu ürün yüksek kaliteli ve güvenilirdir.', categoryId: '20' },
    { id: '54709', name: 'Ürün 20', price: 50000, image: 'product20.jpg', description: 'Bu ürün lüks ve premium bir deneyim sunar.', categoryId: '19' },
    { id: '54710', name: 'Ürün 21', price: 60000, image: 'product21.jpg', description: 'Bu ürün en son teknoloji ile üretilmiştir.', categoryId: '1' },
    { id: '54711', name: 'Ürün 22', price: 75000, image: 'product22.jpg', description: 'Bu ürün yüksek performanslı bir üründür.', categoryId: '3' },
    { id: '54712', name: 'Ürün 23', price: 85000, image: 'product23.jpg', description: 'Bu ürün şık ve zarif bir tasarıma sahiptir.', categoryId: '2' },
    { id: '54713', name: 'Ürün 24', price: 95000, image: 'product24.jpg', description: 'Bu ürün dayanıklı ve uzun ömürlüdür.', categoryId: '4' },
    { id: '54714', name: 'Ürün 25', price: 105000, image: 'product25.jpg', description: 'Bu ürün enerji verimliliği ile dikkat çeker.', categoryId: '5' },
    { id: '54715', name: 'Ürün 26', price: 115000, image: 'product26.jpg', description: 'Bu ürün kullanıcı dostu bir tasarıma sahiptir.', categoryId: '6' },
    { id: '54716', name: 'Ürün 27', price: 125000, image: 'product27.jpg', description: 'Bu ürün yüksek teknoloji ile üretilmiştir.', categoryId: '7' },
];

module.exports = class Product {

    constructor(name, price, image, description, categoryId) {
        this.id = (Math.floor(Math.random() * 99999) + 1).toString();
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.categoryId = categoryId;
    }

    static getAllProducts() {
        return products;
    }

    static getById(id) {
        const product = products.find(p => p.id === id);
        return product || null;
    }

    static getProductsByCategoryId(categoryId) {
        return products.filter(p => p.categoryId === categoryId) || [];
    }

    saveProduct() {
        products.push(this);
    }

    static updateProduct(product) {
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
            products[index] = product;
        }
    }

    static deleteById(id) {
        
        const index = products.findIndex(p => p.id === id);

        if (index !== -1)
            products.splice(index, 1);
    }

};
