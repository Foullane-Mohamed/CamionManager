import { jest } from "@jest/globals";
import * as tripController from "../../controllers/tripController.js";
import * as tripService from "../../services/tripService.js";
import * as tripValidator from "../../validators/tripValidator.js";

jest.mock("../../services/tripService.js");
jest.mock("../../validators/tripValidator.js");

describe("Trip Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("createTrip", () => {
    const validTripData = {
      tripNumber: "TRIP-001",
      assignedDriver: "driver123",
      assignedTruck: "truck123",
      assignedTrailer: "trailer123",
      startPoint: "City A",
      destinationPoint: "City B",
      startDate: "2024-01-01",
      plannedEndDate: "2024-01-05",
      status: "planned",
    };

    it("should create trip successfully", async () => {
      req.body = validTripData;
      tripValidator.validateTrip.mockReturnValue({ error: null });
      tripService.validateDriverExists.mockResolvedValue(true);
      tripService.validateTruckExists.mockResolvedValue(true);
      tripService.validateTrailerExists.mockResolvedValue(true);
      tripService.createTrip.mockResolvedValue({
        _id: "trip123",
        ...validTripData,
      });

      await tripController.createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Trip created successfully",
        data: expect.objectContaining({ _id: "trip123" }),
      });
    });

    it("should return 400 if validation fails", async () => {
      req.body = validTripData;
      tripValidator.validateTrip.mockReturnValue({
        error: { details: [{ message: "Validation error" }] },
      });

      await tripController.createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if driver not found", async () => {
      req.body = validTripData;
      tripValidator.validateTrip.mockReturnValue({ error: null });
      tripService.validateDriverExists.mockResolvedValue(false);

      await tripController.createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Assigned driver not found or is not a chauffeur",
      });
    });

    it("should return 404 if truck not found", async () => {
      req.body = validTripData;
      tripValidator.validateTrip.mockReturnValue({ error: null });
      tripService.validateDriverExists.mockResolvedValue(true);
      tripService.validateTruckExists.mockResolvedValue(false);

      await tripController.createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 404 if trailer not found", async () => {
      req.body = validTripData;
      tripValidator.validateTrip.mockReturnValue({ error: null });
      tripService.validateDriverExists.mockResolvedValue(true);
      tripService.validateTruckExists.mockResolvedValue(true);
      tripService.validateTrailerExists.mockResolvedValue(false);

      await tripController.createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getAllTrips", () => {
    it("should get all trips with filters", async () => {
      req.query = { status: "in-progress", assignedDriver: "driver123" };
      const mockTrips = [
        { _id: "1", tripNumber: "TRIP-001", status: "in-progress" },
        { _id: "2", tripNumber: "TRIP-002", status: "in-progress" },
      ];
      tripService.getAllTrips.mockResolvedValue(mockTrips);

      await tripController.getAllTrips(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockTrips,
      });
    });

    it("should return 500 on error", async () => {
      tripService.getAllTrips.mockRejectedValue(new Error("Error"));

      await tripController.getAllTrips(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getTripById", () => {
    it("should get trip by id successfully", async () => {
      req.params.id = "trip123";
      const mockTrip = { _id: "trip123", tripNumber: "TRIP-001" };
      tripService.getTripById.mockResolvedValue(mockTrip);

      await tripController.getTripById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrip,
      });
    });

    it("should return 404 if trip not found", async () => {
      req.params.id = "nonexistent";
      tripService.getTripById.mockResolvedValue(null);

      await tripController.getTripById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateTrip", () => {
    it("should update trip successfully", async () => {
      req.params.id = "trip123";
      req.body = { status: "in-progress" };
      tripValidator.validateTripUpdate.mockReturnValue({ error: null });
      tripService.getTripById.mockResolvedValue({ _id: "trip123" });
      tripService.updateTrip.mockResolvedValue({
        _id: "trip123",
        status: "in-progress",
      });

      await tripController.updateTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "trip123";
      req.body = { status: "invalid" };
      tripValidator.validateTripUpdate.mockReturnValue({
        error: { details: [{ message: "Invalid status" }] },
      });

      await tripController.updateTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if trip not found", async () => {
      req.params.id = "nonexistent";
      req.body = { status: "in-progress" };
      tripValidator.validateTripUpdate.mockReturnValue({ error: null });
      tripService.getTripById.mockResolvedValue(null);

      await tripController.updateTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
  describe("deleteTrip", () => {
    it("should delete trip successfully", async () => {
      req.params.id = "trip123";
      tripService.deleteTrip.mockResolvedValue({ _id: "trip123" });

      await tripController.deleteTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if trip not found", async () => {
      req.params.id = "nonexistent";
      tripService.deleteTrip.mockResolvedValue(null);

      await tripController.deleteTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateTripStatus", () => {
    it("should update trip status successfully", async () => {
      req.params.id = "trip123";
      req.body = { status: "completed" };
      tripValidator.validateStatusUpdate.mockReturnValue({ error: null });
      tripService.getTripById.mockResolvedValue({ _id: "trip123" });
      tripService.updateTripStatus.mockResolvedValue({
        _id: "trip123",
        status: "completed",
      });

      await tripController.updateTripStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "trip123";
      req.body = { status: "invalid" };
      tripValidator.validateStatusUpdate.mockReturnValue({
        error: { details: [{ message: "Invalid status" }] },
      });

      await tripController.updateTripStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
  describe("getTripsStats", () => {
    it("should get trip statistics successfully", async () => {
      const mockStats = {
        totalTrips: 50,
        completedTrips: 45,
        cancelledTrips: 5,
      };
      tripService.getTripsStats.mockResolvedValue(mockStats);

      await tripController.getTripsStats(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockStats,
      });
    });

    it("should return 500 on error", async () => {
      tripService.getTripsStats.mockRejectedValue(new Error("Error"));

      await tripController.getTripsStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
