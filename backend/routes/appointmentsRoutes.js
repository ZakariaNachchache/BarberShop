// routes/appointmentRoutes.js

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { protect, admin } = require("../middlewares/MiddleWare");

router.get("/my-appointments", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id });

    if (!appointments) {
      return res
        .status(404)
        .json({ message: "No appointments found for this user." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", protect, admin, async (req, res) => {
  try {
    const appointments = await Appointment.find();

    if (!appointments) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
