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
        return connection.execute('INSERT INTO products (name, price, image, description, categoryId) VALUES (?, ?, ?, ?, ?)',
            [this.name, this.price, this.image, this.description, this.categoryId]);
    }

    static updateProduct(product) {
        return connection.execute('UPDATE products SET name = ?, price = ?, image = ?, description = ?, categoryId = ? WHERE id = ?',
            [product.name, product.price, product.image, product.description, product.categoryId, product.id]);
    }

    static deleteProductById(id) {
        return connection.execute('DELETE FROM products WHERE id = ?', [id]);        
    }
};
