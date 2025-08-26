const { Order, OrderItem, MenuItem, User, Payment } = require("../models");



// Create an order with order items
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, customerNotes } = req.body;
    const order = await Order.create({
      UserId: req.user.id,
      status: "pending",
      totalAmount: totalAmount,
      deliveryAddress,
      customerNotes
    });

    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: `MenuItem with id ${item.menuItemId} not found` });
      }
      await OrderItem.create({
        OrderId: order.id,
        MenuItemId: menuItem.id,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions || null,
      });
    }

    return res.status(201).json({ message: "Order created", orderId: order.id });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order", error: error.message });
  }
};
/*
exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  console.log(`incoming info... ${req.body}`);
  const { items, totalAmount } = req.body;
  // items: [{ menuItemId, quantity }]

  try {
    const order = await Order.create({ UserId: userId, status: "pending", totalAmount });

    // Create order items
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: `MenuItem with id ${item.menuItemId} not found` });
      }
      await OrderItem.create({
        OrderId: order.id,
        MenuItemId: menuItem.id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    return res.status(201).json({ message: "Order created", orderId: order.id });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  const { items, totalAmount } = req.body;
  const { id } = req.user.id;
  console.log(`Received info: ${id}, ${items}, ${totalAmount}`);

  try {
    const order = await Order.create({ id, totalAmount });

    const orderItems = items.map(item => ({
      orderId: order.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ message: 'Order placed', orderId: order.id });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
};
*/

// Get orders for logged-in customer
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: [{ model: OrderItem, include: [MenuItem] }, Payment],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get order details by id (admin or owner)
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, include: [MenuItem] }, { model: User, attributes: ['id', 'name', 'phone', 'email'] }, Payment]
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only admin or order owner can view
    if (req.user.role !== "admin" && order.UserId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: get all orders
exports.getAllOrders = async (req, res) => {
  const { status } = req.query;
  try {
    const whereClause = status ? { status } : {};

    const orders = await Order.findAll({
      where: whereClause,
      include: [{ model: OrderItem, include: [MenuItem] }, { model: User, attributes: ['id', 'name', 'email', 'phone'] }, Payment],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
