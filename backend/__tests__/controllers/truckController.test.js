import { jest } from "@jest/globals";
import * as truckController from "../../controllers/truckController.js";
import * as truckService from "../../services/truckService.js";
import * as truckValidator from "../../validators/truckValidator.js";

jest.mock("../../services/truckService.js");
jest.mock("../../validators/truckValidator.js");

describe("Truck Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("createTruck", () => {
    const validTruckData = {
      matricule: "ABC123",
      brand: "Volvo",
      model: "FH16",
      year: 2022,
      fuelType: "diesel",
      status: "available",
    };

    it("should create truck successfully", async () => {
      req.body = validTruckData;
      truckValidator.validateTruck.mockReturnValue({ error: null });
      truckService.getTruckByMatricule.mockResolvedValue(null);
      truckService.createTruck.mockResolvedValue({ _id: "truck123", ...validTruckData });

      await truckController.createTruck(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Truck created successfully",
        truck: expect.objectContaining({ _id: "truck123" }),
      });
    });

    it("should return 400 if validation fails", async () => {
      req.body = validTruckData;
      truckValidator.validateTruck.mockReturnValue({
        error: { details: [{ message: "Matricule is required" }] },
      });

      await truckController.createTruck(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if matricule already exists", async () => {
      req.body = validTruckData;
      truckValidator.validateTruck.mockReturnValue({ error: null });
      truckService.getTruckByMatricule.mockResolvedValue({ _id: "existing" });

      await truckController.createTruck(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "A truck with this matricule already exists",
      });
    });

    it("should return 500 on server error", async () => {
      req.body = validTruckData;
      truckValidator.validateTruck.mockReturnValue({ error: null });
      truckService.getTruckByMatricule.mockRejectedValue(new Error("Error"));

      await truckController.createTruck(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getAllTrucks", () => {
    it("should get all trucks successfully", async () => {
      const mockTrucks = [{ _id: "truck1" }, { _id: "truck2" }];
      truckService.getAllTrucks.mockResolvedValue(mockTrucks);

      await truckController.getAllTrucks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        trucks: mockTrucks,
      });
    });

    it("should return 500 on error", async () => {
      truckService.getAllTrucks.mockRejectedValue(new Error("Error"));

      await truckController.getAllTrucks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getTruckById", () => {
    it("should get truck by id successfully", async () => {
      req.params.id = "truck123";
      const mockTruck = { _id: "truck123", matricule: "ABC123" };
      truckService.getTruckById.mockResolvedValue(mockTruck);

      await truckController.getTruckById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTruck);
    });

    it("should return 404 if truck not found", async () => {
      req.params.id = "nonexistent";
      truckService.getTruckById.mockResolvedValue(null);

      await truckController.getTruckById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on error", async () => {
      req.params.id = "truck123";
      truckService.getTruckById.mockRejectedValue(new Error("Error"));

      await truckController.getTruckById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("updateTruck", () => {
    it("should update truck successfully", async () => {
      req.params.id = "truck123";
      req.body = { brand: "Scania" };
      truckValidator.validateTruckUpdate.mockReturnValue({ error: null });
      truckService.getTruckById.mockResolvedValue({ _id: "truck123", matricule: "ABC123" });
      truckService.updateTruck.mockResolvedValue({ _id: "truck123", brand: "Scania" });

      await truckController.updateTruck(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "truck123";
      req.body = { brand: "" };
      truckValidator.validateTruckUpdate.mockReturnValue({
        error: { details: [{ message: "Invalid data" }] },
      });

      await truckController.updateTruck(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if truck not found", async () => {
      req.params.id = "nonexistent";
      req.body = { brand: "Scania" };
      truckValidator.validateTruckUpdate.mockReturnValue({ error: null });
      truckService.getTruckById.mockResolvedValue(null);

      await truckController.updateTruck(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateTruckStatus", () => {
    it("should update truck status successfully", async () => {
      req.params.id = "truck123";
      req.body = { status: "in-use" };
      truckValidator.validateStatusUpdate.mockReturnValue({ error: null });
      truckService.getTruckById.mockResolvedValue({ _id: "truck123" });
      truckService.updateTruckStatus.mockResolvedValue({ _id: "truck123", status: "in-use" });

      await truckController.updateTruckStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "truck123";
      req.body = { status: "invalid" };
      truckValidator.validateStatusUpdate.mockReturnValue({
        error: { details: [{ message: "Invalid status" }] },
      });

      await truckController.updateTruckStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if truck not found", async () => {
      req.params.id = "nonexistent";
      req.body = { status: "in-use" };
      truckValidator.validateStatusUpdate.mockReturnValue({ error: null });
      truckService.getTruckById.mockResolvedValue(null);

      await truckController.updateTruckStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteTruck", () => {
    it("should delete truck successfully", async () => {
      req.params.id = "truck123";
      truckService.getTruckById.mockResolvedValue({ _id: "truck123" });
      truckService.deleteTruck.mockResolvedValue();

      await truckController.deleteTruck(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if truck not found", async () => {
      req.params.id = "nonexistent";
      truckService.getTruckById.mockResolvedValue(null);

      await truckController.deleteTruck(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getAvailableTrucks", () => {
    it("should get available trucks successfully", async () => {
      const mockTrucks = [{ _id: "truck1" }, { _id: "truck2" }];
      truckService.getAvailableTrucks.mockResolvedValue(mockTrucks);

      await truckController.getAvailableTrucks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        trucks: mockTrucks,
      });
    });

    it("should return 500 on error", async () => {
      truckService.getAvailableTrucks.mockRejectedValue(new Error("Error"));

      await truckController.getAvailableTrucks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getTrucksStats", () => {
    it("should get truck statistics successfully", async () => {
      const mockStats = { total: 10, available: 5, inUse: 3 };
      truckService.getTrucksStats.mockResolvedValue(mockStats);

      await truckController.getTrucksStats(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStats);
    });

    it("should return 500 on error", async () => {
      truckService.getTrucksStats.mockRejectedValue(new Error("Error"));

      await truckController.getTrucksStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
