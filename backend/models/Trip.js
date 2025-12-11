/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - tripNumber
 *         - assignedTruck
 *         - assignedDriver
 *         - startPoint
 *         - destinationPoint
 *         - departureDate
 *         - expectedArrivalDate
 *         - mileageAtDeparture
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         tripNumber:
 *           type: string
 *           description: Unique trip identifier (uppercase)
 *           example: "TRIP-001"
 *         assignedTruck:
 *           type: string
 *           description: ID of the assigned truck
 *         assignedTrailer:
 *           type: string
 *           description: ID of the assigned trailer (optional)
 *         assignedDriver:
 *           type: string
 *           description: ID of the assigned driver
 *         startPoint:
 *           type: string
 *           description: Trip starting location
 *           example: "Paris"
 *         destinationPoint:
 *           type: string
 *           description: Trip destination location
 *           example: "Lyon"
 *         departureDate:
 *           type: string
 *           format: date-time
 *           description: Scheduled departure date and time
 *         expectedArrivalDate:
 *           type: string
 *           format: date-time
 *           description: Expected arrival date and time
 *         actualArrivalDate:
 *           type: string
 *           format: date-time
 *           description: Actual arrival date and time
 *         status:
 *           type: string
 *           enum: [À faire, En cours, Terminé]
 *           default: À faire
 *           description: Current trip status
 *         mileageAtDeparture:
 *           type: number
 *           minimum: 0
 *           description: Truck mileage at departure
 *         mileageAtArrival:
 *           type: number
 *           minimum: 0
 *           description: Truck mileage at arrival
 *         driverRemarks:
 *           type: string
 *           description: Driver's notes or remarks
 *         distance:
 *           type: number
 *           description: Calculated trip distance in kilometers
 *         missionOrderPDF:
 *           type: string
 *           description: URL or path to mission order PDF
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TripInput:
 *       type: object
 *       required:
 *         - assignedTruck
 *         - assignedDriver
 *         - startPoint
 *         - destinationPoint
 *         - departureDate
 *         - expectedArrivalDate
 *         - mileageAtDeparture
 *       properties:
 *         assignedTruck:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         assignedTrailer:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         assignedDriver:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *         startPoint:
 *           type: string
 *           example: "Paris"
 *         destinationPoint:
 *           type: string
 *           example: "Lyon"
 *         departureDate:
 *           type: string
 *           format: date-time
 *           example: "2024-12-15T08:00:00Z"
 *         expectedArrivalDate:
 *           type: string
 *           format: date-time
 *           example: "2024-12-15T18:00:00Z"
 *         mileageAtDeparture:
 *           type: number
 *           example: 150000
 *         driverRemarks:
 *           type: string
 *           example: "Heavy traffic expected"
 */

import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    tripNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    assignedTruck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: [true, "Assigned truck is required"],
    },
    assignedTrailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trailer",
      default: null,
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned driver is required"],
    },
    startPoint: {
      type: String,
      required: [true, "Start point is required"],
      trim: true,
    },
    destinationPoint: {
      type: String,
      required: [true, "Destination point is required"],
      trim: true,
    },
    departureDate: {
      type: Date,
      required: [true, "Departure date is required"],
    },
    expectedArrivalDate: {
      type: Date,
      required: [true, "Expected arrival date is required"],
    },
    actualArrivalDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["À faire", "En cours", "Terminé"],
        message: "{VALUE} is not a valid status",
      },
      default: "À faire",
    },
    mileageAtDeparture: {
      type: Number,
      required: [true, "Mileage at departure is required"],
      min: [0, "Mileage at departure cannot be negative"],
    },
    mileageAtArrival: {
      type: Number,
      default: null,
      min: [0, "Mileage at arrival cannot be negative"],
    },
    driverRemarks: {
      type: String,
      trim: true,
      default: "",
    },
    distance: {
      type: Number,
      default: null,
    },
    missionOrderPDF: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.index({ status: 1 });
tripSchema.index({ assignedDriver: 1 });
tripSchema.index({ assignedTruck: 1 });
tripSchema.index({ departureDate: -1 });

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
