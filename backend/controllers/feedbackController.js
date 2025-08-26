const { Feedback, User, Order } = require("../models");

// Customer: Submit feedback
exports.submitFeedback = async (req, res) => {
  const userId = req.user.id;
  const { comment, rating } = req.body;

  try {
    const feedback = await Feedback.create({
      UserId: userId,
      message: comment,
    });
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: [User],
      order: [["createdAt", "DESC"]],
    });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.checkFirstDelivered = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  try {
    const deliveredOrders = await Order.findAll({
      where: { userId, status: 'Delivered' },
      order: [['createdAt', 'ASC']],
      limit: 1,
    });

    if (deliveredOrders.length === 0) {
      return res.json({ promptFeedback: false });
    }

    const firstOrder = deliveredOrders[0];

    const feedback = await Feedback.findOne({
      where: { userId },
    });

    if (!feedback) {
      return res.json({ promptFeedback: true, orderId: firstOrder.id });
    }

    return res.json({ promptFeedback: false });
  } catch (err) {
    console.error('Check feedback error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
