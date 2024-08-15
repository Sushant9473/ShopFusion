import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./backend/models/productModel.js";
import Category from "./backend/models/categoryModel.js";
import User from "./backend/models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Fetch categories from Fake Store API
const fetchCategories = async () => {
  const response = await axios.get(
    "https://fakestoreapi.com/products/categories"
  );
  return response.data;
};

// Fetch products from Fake Store API
const fetchProducts = async () => {
  const response = await axios.get("https://fakestoreapi.com/products");
  return response.data;
};

// Fetch products from DummyJSON API
const fetchDummyProducts = async () => {
  const response = await axios.get("https://dummyjson.com/products");
  return response.data.products;
};

// Fetch users from Fake Store API
const fetchUsers = async () => {
  const response = await axios.get("https://fakestoreapi.com/users");
  return response.data;
};

// Fetch users from JSONPlaceholder
const fetchPlaceholderUsers = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
};

// Populate categories
const populateCategories = async (categories) => {
  for (const categoryName of categories) {
    await Category.findOneAndUpdate(
      { name: categoryName },
      { name: categoryName },
      { upsert: true, new: true }
    );
  }
  console.log("Categories populated successfully");
};

// Populate products
const populateProducts = async (products) => {
  for (const product of products) {
    let category = await Category.findOne({ name: product.category });
    if (!category) {
      category = await Category.create({ name: product.category });
    }

    await Product.findOneAndUpdate(
      { name: product.title },
      {
        name: product.title,
        image: product.image,
        brand: "Unknown",
        quantity: product.rating.count,
        category: category._id,
        description: product.description,
        rating: product.rating.rate,
        numReviews: 0,
        price: product.price,
        countInStock: product.rating.count,
      },
      { upsert: true, new: true }
    );
  }
  console.log("Products populated successfully");
};

// Populate dummy products
const populateDummyProducts = async (products) => {
  for (const product of products) {
    let category = await Category.findOne({ name: product.category });
    if (!category) {
      category = await Category.create({ name: product.category });
    }

    await Product.findOneAndUpdate(
      { name: product.title },
      {
        name: product.title,
        image: product.images[0],
        brand: product.brand,
        quantity: product.stock,
        category: category._id,
        description: product.description,
        rating: product.rating,
        numReviews: 0,
        price: product.price,
        countInStock: product.stock,
      },
      { upsert: true, new: true }
    );
  }
  console.log("Dummy products populated successfully");
};

// Populate users
const populateUsers = async (users) => {
  for (const user of users) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    await User.findOneAndUpdate(
      { email: user.email },
      {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        isAdmin: false,
      },
      { upsert: true, new: true }
    );
  }

  // Create an admin user
  const adminSalt = await bcrypt.genSalt(10);
  const adminHashedPassword = await bcrypt.hash("adminpassword", adminSalt);

  await User.findOneAndUpdate(
    { email: "admin@example.com" },
    {
      username: "admin",
      email: "admin@example.com",
      password: adminHashedPassword,
      isAdmin: true,
    },
    { upsert: true, new: true }
  );
  console.log("Users populated successfully");
};

// Populate placeholder users
const populatePlaceholderUsers = async (users) => {
  for (const user of users) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("defaultpassword", salt);

    await User.findOneAndUpdate(
      { email: user.email },
      {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        isAdmin: false,
      },
      { upsert: true, new: true }
    );
  }
  console.log("Placeholder users populated successfully");
};

const populateDB = async () => {
  try {
    const categories = await fetchCategories();
    await populateCategories(categories);

    const products = await fetchProducts();
    await populateProducts(products);

    const dummyProducts = await fetchDummyProducts();
    await populateDummyProducts(dummyProducts);

    const users = await fetchUsers();
    await populateUsers(users);

    const placeholderUsers = await fetchPlaceholderUsers();
    await populatePlaceholderUsers(placeholderUsers);

    console.log("Database populated successfully");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    mongoose.disconnect();
  }
};

populateDB();
