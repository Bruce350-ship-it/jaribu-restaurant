require('dotenv').config();
const { sequelize, MenuItem, User } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // ⚠️ DANGER: This drops and recreates all tables

    // 1. Seed Users
    const users = await User.bulkCreate([
      { name: 'Jane Doe', email: 'jane@example.com', phone: '0700123456', password: '$2b$10$gACRtzUhU.g9yCWT6liSB.8Fw7gbb/3.8FZFEXLYKMQFsw9AbJbkW', role: 'customer' },
      { name: 'John Smith', email: 'john@example.com', phone: '0700654321', password: '$2b$10$NoYKDBWUpZSnQuFRcvEv1.7jKtWcbvnHW3JUM1nIQgFeUVU9COKXS', role: 'customer' },
      { name: 'Admin', email: 'admin@example.com', phone: '0752242708', password: '$2b$10$fjQhKCTvUBglTbkcxVfyzu4duaI/uRB5SWmyAm1.IfOWOgNwd0ssC', role: 'admin' }
    ]);

    // 2. Seed Menu Items
    const menuItems = await MenuItem.bulkCreate([
      { name: 'Grilled Salmon', description: 'Fresh Atlantic salmon with herbs and lemon', price: 25000, category: 'Main Courses', image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=400', available: true },
      { name: 'Caesar Salad', description: 'Crisp romaine lettuce with parmesan and croutons', price: 30000, category: 'Desserts', image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400', available: true },
      { name: 'Chocolate Cake', description: 'Rich chocolate cake with vanilla ice cream', price: 12000, category: 'Appetizers', image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400', available: true },
      { name: 'Craft Beer', description: 'Local IPA with citrus notes', price: 8000, category: 'Beverages', image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400', available: false }
    ]);

    console.log('✅ Seeded users and menu items successfully.');
  } catch (err) {
    console.error('❌ Failed to seed database:', err);
  } finally {
    await sequelize.close();
  }
}

seed();
