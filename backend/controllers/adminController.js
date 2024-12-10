const User = require("../models/User");

const createAdminUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      username,
      email,
      password,
      isAdmin: true,
    });

    await user.save();

    res.status(201).json({ message: "Admin user created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAdminUser };
