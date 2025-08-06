const getDb = require('../utility/database').getDb;

class Category {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    static findAll() {
        const db = getDb();

        return db.collection('categories')
            .find({})
            .toArray()
            .then(categories => {
                return categories;
            })
            .catch(err => console.log(err));
    }
}

module.exports = Category;
