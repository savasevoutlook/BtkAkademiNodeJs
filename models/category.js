const categories = [
    { id: '1', name: 'Electronics', slug: 'electronics', description: 'Devices and gadgets' },
    { id: '2', name: 'Books', slug: 'books', description: 'Literature and educational materials' },
    { id: '3', name: 'Clothing', slug: 'clothing', description: 'Apparel and accessories' },
    { id: '4', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Household items and kitchenware' },
    { id: '5', name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Equipment for sports and outdoor activities' },
    { id: '6', name: 'Health & Beauty', slug: 'health-beauty', description: 'Products for health and personal care' },
    { id: '7', name: 'Toys & Games', slug: 'toys-games', description: 'Fun and educational toys for children' },
    { id: '8', name: 'Automotive', slug: 'automotive', description: 'Car parts and accessories' },
    { id: '9', name: 'Music', slug: 'music', description: 'Musical instruments and accessories' },
    { id: '10', name: 'Office Supplies', slug: 'office-supplies', description: 'Items for office use' },
    { id: '11', name: 'Pet Supplies', slug: 'pet-supplies', description: 'Products for pets' },
    { id: '12', name: 'Garden & Outdoor', slug: 'garden-outdoor', description: 'Gardening tools and outdoor furniture' },
    { id: '13', name: 'Baby Products', slug: 'baby-products', description: 'Items for infants and toddlers' },
    { id: '14', name: 'Jewelry', slug: 'jewelry', description: 'Rings, necklaces, and other jewelry' },
    { id: '15', name: 'Arts & Crafts', slug: 'arts-crafts', description: 'Supplies for creative projects' },
    { id: '16', name: 'Video Games', slug: 'video-games', description: 'Consoles and games' },
    { id: '17', name: 'Movies & TV', slug: 'movies-tv', description: 'DVDs and Blu-rays' },
    { id: '18', name: 'Tools & Home Improvement', slug: 'tools-home-improvement', description: 'Tools for home repairs and improvements' },
    { id: '19', name: 'Grocery & Gourmet Food', slug: 'grocery-gourmet-food', description: 'Food items and gourmet products' },
    { id: '20', name: 'Musical Instruments', slug: 'musical-instruments', description: 'Instruments for music production' }
];

module.exports = class Category {
    constructor(name, slug, description) {
        this.id = (categories.length + 1).toString();
        this.name = name;
        this.slug = slug;
        this.description = description;
    }

    static getAllCategories() {
        return categories;
    }

    static getCategoryById(id) {
        return categories.find(c => c.id === id);
    }

    saveCategory() {
        categories.push(this);
        return this;
    }

    static updateCategory(category) {
        const index = categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
            categories[index] = category;
        }
    }

    static deleteCategoryById(id) {
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
            categories.splice(index, 1);
        }
    }
}
