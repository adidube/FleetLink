const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const calculateRideDuration = require("../utility/calculateRideDuration");

exports.bookVehicle = async (req, res) => {
  const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;
  if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
    return res.status(400).json({ error: "Missing booking details" });
  }

  const duration = calculateRideDuration(fromPincode, toPincode);
  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" })
    };

    const overlapping = await Booking.findOne({
      vehicleId,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });

    if (overlapping) {
      return res
        .status(409)
        .json({ message: "Vehicle already booked during this time" });
    }

    const booking = await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
