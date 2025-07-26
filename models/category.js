const connection = require('../utility/database');

module.exports = class Category {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    static getAllCategories() {
        return connection.execute('SELECT * FROM categories');
    }

    static getCategoryById(id) {
        return connection.execute('SELECT * FROM categories WHERE id = ?', [id]);
    }

    saveCategory() {
        return connection.execute('INSERT INTO categories (name, description) VALUES (?, ?)',
            [this.name, this.description]);
    }

    static updateCategory(category) {
        return connection.execute('UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [category.name, category.description, category.id]);
    }

    static deleteCategoryById(id) {
        return connection.execute('DELETE FROM categories WHERE id = ?', [id]);
    }
}
