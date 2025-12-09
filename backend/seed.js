import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Truck from "./models/Truck.js";
import Trailer from "./models/Trailer.js";
import Tire from "./models/Tire.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Truck.deleteMany();
    await Trailer.deleteMany();
    await Tire.deleteMany();

    const admin = await User.create({
      name: "Admin User",
      email: "admin@camion.com",
      password: "admin123",
      role: "admin",
      accountStatus: "approved",
    });

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
    console.log("✅ Users seeded successfully!");

    const truck1 = await Truck.create({
      matricule: "123ABC45",
      brand: "Mercedes-Benz",
      model: "Actros 1851",
      yearOfManufacture: 2020,
      status: "Disponible",
      currentMileage: 45000,
      fuelType: "Diesel",
    });

    const truck2 = await Truck.create({
      matricule: "456DEF78",
      brand: "Volvo",
      model: "FH16 750",
      yearOfManufacture: 2021,
      status: "En Mission",
      currentMileage: 32000,
      fuelType: "Diesel",
    });

    const truck3 = await Truck.create({
      matricule: "789GHI01",
      brand: "Scania",
      model: "R450",
      yearOfManufacture: 2019,
      status: "En Maintenance",
      currentMileage: 78000,
      fuelType: "Diesel",
    });

    const truck4 = await Truck.create({
      matricule: "234JKL56",
      brand: "MAN",
      model: "TGX 18.500",
      yearOfManufacture: 2022,
      status: "Disponible",
      currentMileage: 15000,
      fuelType: "Diesel",
    });

    const truck5 = await Truck.create({
      matricule: "567MNO89",
      brand: "Iveco",
      model: "Stralis 460",
      yearOfManufacture: 2018,
      status: "Disponible",
      currentMileage: 95000,
      fuelType: "Gasoline",
    });

    console.log("✅ Trucks seeded successfully!");

    const trailer1 = await Trailer.create({
      matricule: "REM001FR",
      type: "Frigo",
      maximumLoad: 25000,
      status: "Disponible",
      currentMileage: 12000,
    });

    const trailer2 = await Trailer.create({
      matricule: "REM002PL",
      type: "Plateau",
      maximumLoad: 30000,
      status: "En Mission",
      currentMileage: 8500,
    });

    const trailer3 = await Trailer.create({
      matricule: "REM003FG",
      type: "Fourgon",
      maximumLoad: 20000,
      status: "Disponible",
      currentMileage: 15000,
    });

    const trailer4 = await Trailer.create({
      matricule: "REM004CT",
      type: "Citerne",
      maximumLoad: 35000,
      status: "En Maintenance",
      currentMileage: 22000,
    });

    const trailer5 = await Trailer.create({
      matricule: "REM005BN",
      type: "Benne",
      maximumLoad: 28000,
      status: "Disponible",
      currentMileage: 5000,
    });
    console.log("✅ Trailers seeded successfully!");

    const tire1 = await Tire.create({
      serialNumber: "TIRE001",
      brand: "Michelin",
      size: "315/80R22.5",
      status: "Bon",
      installationDate: new Date("2023-01-15"),
      vehiclePosition: "Front Left",
      associatedVehicleType: "Truck",
      associatedVehicleId: truck1._id,
    });

    const tire2 = await Tire.create({
      serialNumber: "TIRE002",
      brand: "Bridgestone",
      size: "315/80R22.5",
      status: "Bon",
      installationDate: new Date("2023-01-15"),
      vehiclePosition: "Front Right",
      associatedVehicleType: "Truck",
      associatedVehicleId: truck1._id,
    });

    const tire3 = await Tire.create({
      serialNumber: "TIRE003",
      brand: "Continental",
      size: "295/80R22.5",
      status: "À remplacer",
      installationDate: new Date("2022-06-10"),
      vehiclePosition: "Rear Left",
      associatedVehicleType: "Truck",
      associatedVehicleId: truck2._id,
    });

    const tire4 = await Tire.create({
      serialNumber: "TIRE004",
      brand: "Goodyear",
      size: "385/65R22.5",
      status: "Bon",
      installationDate: new Date("2023-03-20"),
      vehiclePosition: "Trailer Front Left",
      associatedVehicleType: "Trailer",
      associatedVehicleId: trailer1._id,
    });

    const tire5 = await Tire.create({
      serialNumber: "TIRE005",
      brand: "Michelin",
      size: "385/65R22.5",
      status: "Bon",
      installationDate: new Date("2023-03-20"),
      vehiclePosition: "Trailer Front Right",
      associatedVehicleType: "Trailer",
      associatedVehicleId: trailer1._id,
    });

    const tire6 = await Tire.create({
      serialNumber: "TIRE006",
      brand: "Pirelli",
      size: "295/80R22.5",
      status: "Usé",
      installationDate: new Date("2021-08-15"),
      vehiclePosition: "Rear Right",
      associatedVehicleType: "Truck",
      associatedVehicleId: truck3._id,
    });

    const tire7 = await Tire.create({
      serialNumber: "TIRE007",
      brand: "Bridgestone",
      size: "315/80R22.5",
      status: "Bon",
      installationDate: new Date("2023-05-10"),
      vehiclePosition: "Spare",
      associatedVehicleType: "Truck",
      associatedVehicleId: truck4._id,
    });

    const tire8 = await Tire.create({
      serialNumber: "TIRE008",
      brand: "Continental",
      size: "385/65R22.5",
      status: "Bon",
      installationDate: new Date("2023-02-28"),
      vehiclePosition: "Trailer Rear Left",
      associatedVehicleType: "Trailer",
      associatedVehicleId: trailer2._id,
    });

    console.log("✅ Tires seeded successfully!");
    console.log("✅ Database seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
