import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bycrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all fields");
  }

  const salt = await bycrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash(password, salt);

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send({ message: "User already exists" });
  }

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch {
    res.status(400).send({ message: "Invalid user data" });
  }
});

export { createUser };
