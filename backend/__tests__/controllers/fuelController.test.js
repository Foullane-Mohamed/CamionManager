import { jest } from "@jest/globals";
import * as fuelController from "../../controllers/fuelController.js";
import * as fuelService from "../../services/fuelService.js";
import * as fuelValidator from "../../validators/fuelValidator.js";

jest.mock("../../services/fuelService.js");
jest.mock("../../validators/fuelValidator.js");

describe("Fuel Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("createFuel", () => {
    const validFuelData = {
      linkedDriver: "driver123",
      linkedVehicle: "truck123",
      linkedTrip: "trip123",
      dateOfFill: "2024-01-15",
      quantityInLiters: 200,
      costPerLiter: 1.5,
      fuelStationLocation: "Station A",
    };

    it("should create fuel record successfully", async () => {
      req.body = validFuelData;
      fuelValidator.validateFuel.mockReturnValue({ error: null });
      fuelService.validateDriverExists.mockResolvedValue(true);
      fuelService.validateVehicleExists.mockResolvedValue(true);
      fuelService.createFuel.mockResolvedValue({ _id: "fuel123", ...validFuelData });

      await fuelController.createFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 400 if validation fails", async () => {
      req.body = validFuelData;
      fuelValidator.validateFuel.mockReturnValue({
        error: { details: [{ message: "Quantity is required" }] },
      });

      await fuelController.createFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if driver not found", async () => {
      req.body = validFuelData;
      fuelValidator.validateFuel.mockReturnValue({ error: null });
      fuelService.validateDriverExists.mockResolvedValue(false);

      await fuelController.createFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 404 if vehicle not found", async () => {
      req.body = validFuelData;
      fuelValidator.validateFuel.mockReturnValue({ error: null });
      fuelService.validateDriverExists.mockResolvedValue(true);
      fuelService.validateVehicleExists.mockResolvedValue(false);

      await fuelController.createFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on server error", async () => {
      req.body = validFuelData;
      fuelValidator.validateFuel.mockReturnValue({ error: null });
      fuelService.validateDriverExists.mockRejectedValue(new Error("Error"));

      await fuelController.createFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getAllFuels", () => {
    it("should get all fuel records successfully", async () => {
      const mockFuels = [{ _id: "fuel1" }, { _id: "fuel2" }];
      fuelService.getAllFuels.mockResolvedValue(mockFuels);

      await fuelController.getAllFuels(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      fuelService.getAllFuels.mockRejectedValue(new Error("Error"));

      await fuelController.getAllFuels(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getFuelById", () => {
    it("should get fuel record by id successfully", async () => {
      req.params.id = "fuel123";
      const mockFuel = { _id: "fuel123", quantityInLiters: 200 };
      fuelService.getFuelById.mockResolvedValue(mockFuel);

      await fuelController.getFuelById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if fuel record not found", async () => {
      req.params.id = "nonexistent";
      fuelService.getFuelById.mockResolvedValue(null);

      await fuelController.getFuelById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on error", async () => {
      req.params.id = "fuel123";
      fuelService.getFuelById.mockRejectedValue(new Error("Error"));

      await fuelController.getFuelById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("updateFuel", () => {
    it("should update fuel record successfully", async () => {
      req.params.id = "fuel123";
      req.body = { quantityInLiters: 250 };
      fuelValidator.validateFuelUpdate.mockReturnValue({ error: null });
      fuelService.updateFuel.mockResolvedValue({ _id: "fuel123", quantityInLiters: 250 });

      await fuelController.updateFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "fuel123";
      req.body = { quantityInLiters: -10 };
      fuelValidator.validateFuelUpdate.mockReturnValue({
        error: { details: [{ message: "Invalid quantity" }] },
      });

      await fuelController.updateFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if fuel record not found", async () => {
      req.params.id = "nonexistent";
      req.body = { quantityInLiters: 250 };
      fuelValidator.validateFuelUpdate.mockReturnValue({ error: null });
      fuelService.updateFuel.mockResolvedValue(null);

      await fuelController.updateFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteFuel", () => {
    it("should delete fuel record successfully", async () => {
      req.params.id = "fuel123";
      fuelService.deleteFuel.mockResolvedValue({ _id: "fuel123" });

      await fuelController.deleteFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if fuel record not found", async () => {
      req.params.id = "nonexistent";
      fuelService.deleteFuel.mockResolvedValue(null);

      await fuelController.deleteFuel(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getFuelsByDriver", () => {
    it("should get fuel records by driver successfully", async () => {
      req.params.driverId = "driver123";
      const mockFuels = [{ _id: "fuel1" }, { _id: "fuel2" }];
      fuelService.getFuelsByDriver.mockResolvedValue(mockFuels);

      await fuelController.getFuelsByDriver(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      req.params.driverId = "driver123";
      fuelService.getFuelsByDriver.mockRejectedValue(new Error("Error"));

      await fuelController.getFuelsByDriver(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getFuelsByVehicle", () => {
    it("should get fuel records by vehicle successfully", async () => {
      req.params.vehicleId = "truck123";
      const mockFuels = [{ _id: "fuel1" }, { _id: "fuel2" }];
      fuelService.getFuelsByVehicle.mockResolvedValue(mockFuels);

      await fuelController.getFuelsByVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      req.params.vehicleId = "truck123";
      fuelService.getFuelsByVehicle.mockRejectedValue(new Error("Error"));

      await fuelController.getFuelsByVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getFuelsByTrip", () => {
    it("should get fuel records by trip successfully", async () => {
      req.params.tripId = "trip123";
      const mockFuels = [{ _id: "fuel1" }, { _id: "fuel2" }];
      fuelService.getFuelsByTrip.mockResolvedValue(mockFuels);

      await fuelController.getFuelsByTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      req.params.tripId = "trip123";
      fuelService.getFuelsByTrip.mockRejectedValue(new Error("Error"));

      await fuelController.getFuelsByTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getFuelsStats", () => {
    it("should get fuel statistics successfully", async () => {
      const mockStats = { totalLiters: 5000, totalCost: 7500 };
      fuelService.getFuelsStats.mockResolvedValue(mockStats);

      await fuelController.getFuelsStats(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      fuelService.getFuelsStats.mockRejectedValue(new Error("Error"));

      await fuelController.getFuelsStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
