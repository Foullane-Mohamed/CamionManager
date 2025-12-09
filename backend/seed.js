import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany();

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@camion.com",
      password: "admin123",
      role: "admin",
      accountStatus: "approved",
    });

    // Create approved chauffeur
    const chauffeur1 = await User.create({
      name: "Mohamed Alami",
      email: "mohamed@chauffeur.com",
      password: "chauffeur123",
      role: "chauffeur",
      phoneNumber: "0612345678",
      nationalId: "AB123456",
      licenseNumber: "LIC123456",
      licenseType: "C",
      address: "123 Rue Mohammed V, Casablanca",
      dateOfBirth: new Date("1985-05-15"),
      accountStatus: "approved",
    });

    // Create pending chauffeur
    const chauffeur2 = await User.create({
      name: "Ahmed Bennani",
      email: "ahmed@chauffeur.com",
      password: "chauffeur123",
      role: "chauffeur",
      phoneNumber: "0698765432",
      nationalId: "CD789012",
      licenseNumber: "LIC789012",
      licenseType: "EC",
      address: "456 Avenue Hassan II, Rabat",
      dateOfBirth: new Date("1990-08-20"),
      accountStatus: "pending",
    });

  console.log(" Database seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedUsers();
