const { CateringRequest, User } = require("../models");

// Customer: Create a catering request
exports.createRequest = async (req, res) => {
  const userId = req.user.id;
  const { eventDate, time, guestCount, location, description } = req.body;

  try {
    const request = await CateringRequest.create({
      UserId: userId,
      eventDate,
      time,
      guests: guestCount,
      location,
      details: description,
    });
    res.status(201).json({ message: "Catering request created", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Customer/Admin: Get all requests for user (admin gets all)
exports.getRequests = async (req, res) => {
  try {
    let where = {};
    if (req.user.role !== "admin") {
      where.UserId = req.user.id;
    }
    const requests = await CateringRequest.findAll({
      where,
      include: [User],
      order: [["eventDate", "ASC"]],
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Update request status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await CateringRequest.findByPk(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    res.json({ message: "Catering request status updated", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
