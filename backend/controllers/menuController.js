const { MenuItem } = require("../models");

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create menu item (admin only)
exports.createMenuItem = async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  try {
    const newItem = await MenuItem.create({ name, description, price, imageUrl });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating menu item", error: error.message });
  }
};

// Update menu item (admin only)
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, available } = req.body;
  try {
    const item = await MenuItem.findByPk(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    await item.update({ name, description, price, image, available });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item", error: error.message });
  }
};

// Delete menu item (admin only)
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await MenuItem.findByPk(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    await item.destroy();
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item", error: error.message });
  }
};
