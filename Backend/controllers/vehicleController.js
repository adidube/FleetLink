const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const calculateRideDuration = require("../utility/calculateRideDuration");

exports.addVehicle = async (req, res) => {
  const { name, capacityKg, tyres } = req.body;
  if (!name || !capacityKg || !tyres) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableVehicles = async (req, res) => {
  const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
  if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
    return res.status(400).json({ message: "Missing required query parameters" });
  }

  const duration = calculateRideDuration(fromPincode, toPincode);
  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

  try {
    const vehicles = await Vehicle.find({
      capacityKg: { $gte: capacityRequired },
    });
    const available = [];

    for (const vehicle of vehicles) {
      const overlapping = await Booking.findOne({
        vehicleId: vehicle._id,
        $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
      });

      if (!overlapping) {
        available.push({
          ...vehicle.toObject(),
          estimatedRideDurationHours: duration,
        });
      }
    }

    res.status(200).json(available);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
