import mongoose from "mongoose";
import { seedUsers } from "./userSeed.js"; // Import user seed function
import { seedBooks } from "./bookSeed.js";
import User from "../models/User.module.js";

mongoose.connect("replace it with mongo-url");

const seedData = async () => {
  try {
    // Seed users first
    await seedUsers();

    // Fetch the users after seeding to link profiles to them
    const users = await User.find();

    await seedBooks(users);

    console.log("Data seeding completed!");
    mongoose.disconnect(); // Disconnect from the database once seeding is done
  } catch (err) {
    console.error("Error while seeding data:", err);
  }
};

// Run the seed data function
seedData();
