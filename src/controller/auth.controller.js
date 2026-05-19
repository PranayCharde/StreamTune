const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  const { name, email, password, role = "user" } = req.body;

  const isUserExist = await userModel.findOne({
    $or: [{ email }, { name }],
  });
  if (isUserExist) {
    return res.status(409).json({ message: "User already exists" });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    name,
    email,
    password: hash,
    role,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

async function loginUser(req, res) {
  const { email, password, name } = req.body;

  const user = await userModel.findOne({
    $or: [{ email }, { name }],
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  res.cookie("token", token);
  res.json({
    message: "Login successful",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

module.exports = {
  registerUser,
  loginUser,
};
