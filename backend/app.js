const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// const MONGO_URI = process.env.MONGO_URI || "";
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

const bookingRoutes = require("./routes/BookingRoutes");
const authRoutes = require("./routes/AuthRoutes");
const appointmentsRoutes = require("./routes/appointmentsRoutes");
app.use("/booking", bookingRoutes);
app.use("/auth", authRoutes);
app.use("/appointments", appointmentsRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Barbershop !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
