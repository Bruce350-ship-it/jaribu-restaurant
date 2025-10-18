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
      // APPETIZERS & STARTERS
      { name: 'Samosa', description: 'Chicken, Beef, or Vegetable samosas (2 pairs)', price: 5000, category: 'Appetizers', image: 'https://images.pexels.com/photos/7592526/pexels-photo-7592526.jpeg', available: true },
      { name: 'Chaps', description: 'Grilled spiced beef strips', price: 2000, category: 'Appetizers', image: '#', available: false },
      { name: 'Rolex', description: 'Ugandan street-style rolled chapati with eggs and vegetables', price: 5000, category: 'Appetizers', image: '#', available: false },
      { name: 'Chicken Drumsticks', description: 'Crispy fried chicken drumsticks served hot', price: 9000, category: 'Appetizers', image: 'https://images.pexels.com/photos/34305982/pexels-photo-34305982.jpeg', available: true },

      // MAIN COURSES
      { name: 'Goat Special', description: 'Grilled goat ribs served with rice and greens', price: 20000, category: 'Main Courses', image: 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg', available: true },
      { name: 'Chicken Special', description: 'Grilled chicken pilau served with beans or peas and greens', price: 20000, category: 'Main Courses', image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', available: true },
      { name: 'Fish Special', description: 'Grilled whole tilapia in coconut curry sauce with steamed rice', price: 25000, category: 'Main Courses', image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg', available: true },
      { name: 'Beef Special', description: 'Traditional steamed plantains with tender beef stew', price: 20000, category: 'Main Courses', image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg', available: true },
      { name: 'Vegetarian Curry', description: 'Mixed vegetables in rich coconut-tomato curry served with chapati', price: 24000, category: 'Main Courses', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', available: true },

      // DESSERTS
      { name: 'Fresh Fruit Platter', description: 'Assorted seasonal fresh fruits', price: 8000, category: 'Desserts', image: 'https://images.pexels.com/photos/5677917/pexels-photo-5677917.jpeg', available: true },
      { name: 'Cake Slice', description: 'Choice of Vanilla, Chocolate, or Carrot cake slice', price: 7000, category: 'Desserts', image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400', available: true },
      { name: 'Ice Cream', description: 'Choice of Vanilla, Chocolate, or Strawberry ice cream', price: 10000, category: 'Desserts', image: 'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=400', available: true },

      // BEVERAGES
      { name: 'African Tea', description: 'Spiced ginger tea with milk', price: 6000, category: 'Beverages', image: 'https://images.pexels.com/photos/4974543/pexels-photo-4974543.jpeg', available: true },
      { name: 'Black Tea', description: 'Plain or spiced black tea with ginger', price: 5000, category: 'Beverages', image: 'https://images.pexels.com/photos/734983/pexels-photo-734983.jpeg', available: true },
      { name: 'Fresh Fruit Juice', description: 'Freshly squeezed fruit juice', price: 4000, category: 'Beverages', image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400', available: true },
      { name: 'Soft Drinks', description: 'Assorted carbonated soft drinks', price: 2000, category: 'Beverages', image: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg', available: true },
      { name: 'Bottled Water', description: 'Mineral bottled drinking water', price: 2000, category: 'Beverages', image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=400', available: true },
      { name: 'Beer', description: 'Cold local beer', price: 5000, category: 'Beverages', image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400', available: true },
    ]);

    console.log('✅ Seeded users and menu items successfully.');
  } catch (err) {
    console.error('❌ Failed to seed database:', err);
  } finally {
    await sequelize.close();
  }
}

seed();

