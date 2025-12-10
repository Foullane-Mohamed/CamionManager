import { jest } from "@jest/globals";
import * as tireController from "../../controllers/tireController.js";
import * as tireService from "../../services/tireService.js";
import * as tireValidator from "../../validators/tireValidator.js";

jest.mock("../../services/tireService.js");
jest.mock("../../validators/tireValidator.js");

describe("Tire Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("createTire", () => {
    const validTireData = {
      serialNumber: "TIRE123",
      brand: "Michelin",
      size: "315/80R22.5",
      associatedVehicleType: "truck",
      associatedVehicleId: "truck123",
      vehiclePosition: "front-left",
      status: "good",
    };

    it("should create tire successfully", async () => {
      req.body = validTireData;
      tireValidator.validateTire.mockReturnValue({ error: null });
      tireService.getTireBySerialNumber.mockResolvedValue(null);
      tireService.validateVehicleExists.mockResolvedValue(true);
      tireService.createTire.mockResolvedValue({ _id: "tire123", ...validTireData });

      await tireController.createTire(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 400 if validation fails", async () => {
      req.body = validTireData;
      tireValidator.validateTire.mockReturnValue({
        error: { details: [{ message: "Serial number is required" }] },
      });

      await tireController.createTire(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if serial number already exists", async () => {
      req.body = validTireData;
      tireValidator.validateTire.mockReturnValue({ error: null });
      tireService.getTireBySerialNumber.mockResolvedValue({ _id: "existing" });

      await tireController.createTire(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if vehicle not found", async () => {
      req.body = validTireData;
      tireValidator.validateTire.mockReturnValue({ error: null });
      tireService.getTireBySerialNumber.mockResolvedValue(null);
      tireService.validateVehicleExists.mockResolvedValue(false);

      await tireController.createTire(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on server error", async () => {
      req.body = validTireData;
      tireValidator.validateTire.mockReturnValue({ error: null });
      tireService.getTireBySerialNumber.mockRejectedValue(new Error("Error"));

      await tireController.createTire(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getAllTires", () => {
    it("should get all tires successfully", async () => {
      const mockTires = [{ _id: "tire1" }, { _id: "tire2" }];
      tireService.getAllTires.mockResolvedValue(mockTires);

      await tireController.getAllTires(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      tireService.getAllTires.mockRejectedValue(new Error("Error"));

      await tireController.getAllTires(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getTireById", () => {
    it("should get tire by id successfully", async () => {
      req.params.id = "tire123";
      const mockTire = { _id: "tire123", serialNumber: "TIRE123" };
      tireService.getTireById.mockResolvedValue(mockTire);

      await tireController.getTireById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if tire not found", async () => {
      req.params.id = "nonexistent";
      tireService.getTireById.mockResolvedValue(null);

      await tireController.getTireById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on error", async () => {
      req.params.id = "tire123";
      tireService.getTireById.mockRejectedValue(new Error("Error"));

      await tireController.getTireById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("updateTire", () => {
    it("should update tire successfully", async () => {
      req.params.id = "tire123";
      req.body = { brand: "Goodyear" };
      tireValidator.validateTireUpdate.mockReturnValue({ error: null });
      tireService.getTireById.mockResolvedValue({ _id: "tire123", serialNumber: "TIRE123" });
      tireService.updateTire.mockResolvedValue({ _id: "tire123", brand: "Goodyear" });

      await tireController.updateTire(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "tire123";
      req.body = { brand: "" };
      tireValidator.validateTireUpdate.mockReturnValue({
        error: { details: [{ message: "Invalid data" }] },
      });

      await tireController.updateTire(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if tire not found", async () => {
      req.params.id = "nonexistent";
      req.body = { brand: "Goodyear" };
      tireValidator.validateTireUpdate.mockReturnValue({ error: null });
      tireService.getTireById.mockResolvedValue(null);

      await tireController.updateTire(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateTireStatus", () => {
    it("should update tire status successfully", async () => {
      req.params.id = "tire123";
      req.body = { status: "worn" };
      tireValidator.validateStatusUpdate.mockReturnValue({ error: null });
      tireService.getTireById.mockResolvedValue({ _id: "tire123" });
      tireService.updateTireStatus.mockResolvedValue({ _id: "tire123", status: "worn" });

      await tireController.updateTireStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "tire123";
      req.body = { status: "invalid" };
      tireValidator.validateStatusUpdate.mockReturnValue({
        error: { details: [{ message: "Invalid status" }] },
      });

      await tireController.updateTireStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if tire not found", async () => {
      req.params.id = "nonexistent";
      req.body = { status: "worn" };
      tireValidator.validateStatusUpdate.mockReturnValue({ error: null });
      tireService.getTireById.mockResolvedValue(null);

      await tireController.updateTireStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteTire", () => {
    it("should delete tire successfully", async () => {
      req.params.id = "tire123";
      tireService.getTireById.mockResolvedValue({ _id: "tire123" });
      tireService.deleteTire.mockResolvedValue();

      await tireController.deleteTire(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if tire not found", async () => {
      req.params.id = "nonexistent";
      tireService.getTireById.mockResolvedValue(null);

      await tireController.deleteTire(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getTiresByVehicle", () => {
    it("should get tires by vehicle successfully", async () => {
      req.params = { vehicleType: "truck", vehicleId: "truck123" };
      const mockTires = [{ _id: "tire1" }, { _id: "tire2" }];
      tireService.getTiresByVehicle.mockResolvedValue(mockTires);

      await tireController.getTiresByVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      req.params = { vehicleType: "truck", vehicleId: "truck123" };
      tireService.getTiresByVehicle.mockRejectedValue(new Error("Error"));

      await tireController.getTiresByVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getTiresByStatus", () => {
    it("should get tires by status successfully", async () => {
      req.params = { status: "good" };
      const mockTires = [{ _id: "tire1" }, { _id: "tire2" }];
      tireService.getTiresByStatus.mockResolvedValue(mockTires);

      await tireController.getTiresByStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      req.params = { status: "good" };
      tireService.getTiresByStatus.mockRejectedValue(new Error("Error"));

      await tireController.getTiresByStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getTiresStats", () => {
    it("should get tire statistics successfully", async () => {
      const mockStats = { total: 50, good: 30, worn: 15, damaged: 5 };
      tireService.getTiresStats.mockResolvedValue(mockStats);

      await tireController.getTiresStats(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      tireService.getTiresStats.mockRejectedValue(new Error("Error"));

      await tireController.getTiresStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
