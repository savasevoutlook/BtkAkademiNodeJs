const connection = require('../utility/database');

module.exports = class Product {

    constructor(name, price, image, description, categoryId) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.categoryId = categoryId;
    }

    static getAllProducts() {
        return connection.execute('SELECT * FROM products');
    }

    static getProductById(id) {
        return connection.execute('SELECT * FROM products WHERE id = ?', [id])
    }

    static getProductsByCategoryId(categoryId) {
        return products.filter(p => p.categoryId === categoryId) || [];
    }

    saveProduct() {
        connection.execute(
            'INSERT INTO products (name, price, image, description, categoryId) VALUES (?, ?, ?, ?, ?)',
            [this.name, this.price, this.image, this.description, this.categoryId]
        );
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
