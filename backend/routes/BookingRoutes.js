// routes/appointmentRoutes.js

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { protect } = require("../middlewares/MiddleWare");

router.post("/check-time", protect, async (req, res) => {
  const { date } = req.body;

  try {
    const existingAppointment = await Appointment.findOne({ date });

    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot is already taken!" });
    }

    res.status(200).json({ message: "Time slot is available!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/book", protect, async (req, res) => {
  const { service, date } = req.body;

  // Check time slot
  const existingAppointment = await Appointment.findOne({ date });
  if (existingAppointment) {
    return res.status(400).json({ message: "Time slot is already taken!" });
  }

  const appointment = new Appointment({
    user: req.user,
    service,
    date,
  });

  try {
    await appointment.save();
    res.status(201).send({ message: "Appointment booked successfully!" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/cancel", protect, async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found!" });
    }

    if (appointment.status === "canceled") {
      return res
        .status(400)
        .json({ message: "Appointment is already canceled!" });
    }

    appointment.status = "canceled";
    await appointment.save();

    res.status(200).json({ message: "Appointment canceled successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/reschedule", protect, async (req, res) => {
  const { appointmentId, newDate } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found!" });
    }

    const existingAppointment = await Appointment.findOne({ date: newDate });

    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot is already taken!" });
    }

    appointment.date = newDate;
    await appointment.save();

    res.status(200).json({ message: "Appointment rescheduled successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
