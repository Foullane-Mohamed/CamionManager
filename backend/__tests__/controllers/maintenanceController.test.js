import { jest } from "@jest/globals";
import * as maintenanceController from "../../controllers/maintenanceController.js";
import * as maintenanceService from "../../services/maintenanceService.js";
import * as maintenanceValidator from "../../validators/maintenanceValidator.js";

jest.mock("../../services/maintenanceService.js");
jest.mock("../../validators/maintenanceValidator.js");

describe("Maintenance Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, user: { userId: "user123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("createMaintenanceRule", () => {
    it("should create maintenance rule successfully", async () => {
      req.body = { maintenanceType: "oil-change", intervalKm: 10000 };
      maintenanceValidator.createMaintenanceRuleValidator.mockReturnValue({ error: null });
      maintenanceService.createMaintenanceRule.mockResolvedValue({ _id: "rule123" });

      await maintenanceController.createMaintenanceRule(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 400 if validation fails", async () => {
      req.body = { maintenanceType: "oil-change" };
      maintenanceValidator.createMaintenanceRuleValidator.mockReturnValue({
        error: { details: [{ message: "Interval is required" }] },
      });

      await maintenanceController.createMaintenanceRule(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on server error", async () => {
      req.body = { maintenanceType: "oil-change", intervalKm: 10000 };
      maintenanceValidator.createMaintenanceRuleValidator.mockReturnValue({ error: null });
      maintenanceService.createMaintenanceRule.mockRejectedValue(new Error("Error"));

      await maintenanceController.createMaintenanceRule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getAllMaintenanceRules", () => {
    it("should get all maintenance rules successfully", async () => {
      const mockRules = [{ _id: "rule1" }, { _id: "rule2" }];
      maintenanceService.getAllMaintenanceRules.mockResolvedValue(mockRules);

      await maintenanceController.getAllMaintenanceRules(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      maintenanceService.getAllMaintenanceRules.mockRejectedValue(new Error("Error"));

      await maintenanceController.getAllMaintenanceRules(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getMaintenanceRuleById", () => {
    it("should get maintenance rule by id successfully", async () => {
      req.params.id = "rule123";
      const mockRule = { _id: "rule123", maintenanceType: "oil-change" };
      maintenanceService.getMaintenanceRuleById.mockResolvedValue(mockRule);

      await maintenanceController.getMaintenanceRuleById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if rule not found", async () => {
      req.params.id = "nonexistent";
      maintenanceService.getMaintenanceRuleById.mockRejectedValue(new Error("Not found"));

      await maintenanceController.getMaintenanceRuleById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateMaintenanceRule", () => {
    it("should update maintenance rule successfully", async () => {
      req.params.id = "rule123";
      req.body = { intervalKm: 15000 };
      maintenanceValidator.updateMaintenanceRuleValidator.mockReturnValue({ error: null });
      maintenanceService.updateMaintenanceRule.mockResolvedValue({ _id: "rule123" });

      await maintenanceController.updateMaintenanceRule(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "rule123";
      req.body = { intervalKm: -1000 };
      maintenanceValidator.updateMaintenanceRuleValidator.mockReturnValue({
        error: { details: [{ message: "Invalid interval" }] },
      });

      await maintenanceController.updateMaintenanceRule(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if rule not found", async () => {
      req.params.id = "nonexistent";
      req.body = { intervalKm: 15000 };
      maintenanceValidator.updateMaintenanceRuleValidator.mockReturnValue({ error: null });
      maintenanceService.updateMaintenanceRule.mockRejectedValue(new Error("Maintenance rule not found"));

      await maintenanceController.updateMaintenanceRule(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteMaintenanceRule", () => {
    it("should delete maintenance rule successfully", async () => {
      req.params.id = "rule123";
      maintenanceService.deleteMaintenanceRule.mockResolvedValue();

      await maintenanceController.deleteMaintenanceRule(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if rule not found", async () => {
      req.params.id = "nonexistent";
      maintenanceService.deleteMaintenanceRule.mockRejectedValue(new Error("Maintenance rule not found"));

      await maintenanceController.deleteMaintenanceRule(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("createMaintenance", () => {
    it("should create maintenance record successfully", async () => {
      req.body = { maintenanceType: "oil-change", linkedVehicle: "truck123" };
      maintenanceValidator.createMaintenanceValidator.mockReturnValue({ error: null });
      maintenanceService.createMaintenance.mockResolvedValue({ _id: "maint123" });

      await maintenanceController.createMaintenance(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 400 if validation fails", async () => {
      req.body = { maintenanceType: "oil-change" };
      maintenanceValidator.createMaintenanceValidator.mockReturnValue({
        error: { details: [{ message: "Type is required" }] },
      });

      await maintenanceController.createMaintenance(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on server error", async () => {
      req.body = { maintenanceType: "oil-change", linkedVehicle: "truck123" };
      maintenanceValidator.createMaintenanceValidator.mockReturnValue({ error: null });
      maintenanceService.createMaintenance.mockRejectedValue(new Error("Error"));

      await maintenanceController.createMaintenance(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getAllMaintenances", () => {
    it("should get all maintenance records successfully", async () => {
      const mockMaintenances = [{ _id: "maint1" }, { _id: "maint2" }];
      maintenanceService.getAllMaintenances.mockResolvedValue(mockMaintenances);

      await maintenanceController.getAllMaintenances(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      maintenanceService.getAllMaintenances.mockRejectedValue(new Error("Error"));

      await maintenanceController.getAllMaintenances(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getMaintenanceById", () => {
    it("should get maintenance record by id successfully", async () => {
      req.params.id = "maint123";
      const mockMaintenance = { _id: "maint123", maintenanceType: "oil-change" };
      maintenanceService.getMaintenanceById.mockResolvedValue(mockMaintenance);

      await maintenanceController.getMaintenanceById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if maintenance not found", async () => {
      req.params.id = "nonexistent";
      maintenanceService.getMaintenanceById.mockRejectedValue(new Error("Not found"));

      await maintenanceController.getMaintenanceById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getMaintenancesByVehicle", () => {
    it("should get maintenance records by vehicle successfully", async () => {
      req.params.vehicleId = "truck123";
      const mockMaintenances = [{ _id: "maint1" }, { _id: "maint2" }];
      maintenanceService.getMaintenancesByVehicle.mockResolvedValue(mockMaintenances);

      await maintenanceController.getMaintenancesByVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 on error", async () => {
      req.params.vehicleId = "truck123";
      maintenanceService.getMaintenancesByVehicle.mockRejectedValue(new Error("Error"));

      await maintenanceController.getMaintenancesByVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateMaintenance", () => {
    it("should update maintenance record successfully", async () => {
      req.params.id = "maint123";
      req.body = { description: "Updated description" };
      maintenanceValidator.updateMaintenanceValidator.mockReturnValue({ error: null });
      maintenanceService.updateMaintenance.mockResolvedValue({ _id: "maint123" });

      await maintenanceController.updateMaintenance(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "maint123";
      req.body = { description: "" };
      maintenanceValidator.updateMaintenanceValidator.mockReturnValue({
        error: { details: [{ message: "Invalid data" }] },
      });

      await maintenanceController.updateMaintenance(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if maintenance not found", async () => {
      req.params.id = "nonexistent";
      req.body = { description: "Updated" };
      maintenanceValidator.updateMaintenanceValidator.mockReturnValue({ error: null });
      maintenanceService.updateMaintenance.mockRejectedValue(new Error("Maintenance record not found"));

      await maintenanceController.updateMaintenance(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateMaintenanceStatus", () => {
    it("should update maintenance status successfully", async () => {
      req.params.id = "maint123";
      req.body = { status: "completed" };
      maintenanceValidator.updateMaintenanceStatusValidator.mockReturnValue({ error: null });
      maintenanceService.updateMaintenanceStatus.mockResolvedValue({ _id: "maint123" });

      await maintenanceController.updateMaintenanceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "maint123";
      req.body = { status: "invalid" };
      maintenanceValidator.updateMaintenanceStatusValidator.mockReturnValue({
        error: { details: [{ message: "Invalid status" }] },
      });

      await maintenanceController.updateMaintenanceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if maintenance not found", async () => {
      req.params.id = "nonexistent";
      req.body = { status: "completed" };
      maintenanceValidator.updateMaintenanceStatusValidator.mockReturnValue({ error: null });
      maintenanceService.updateMaintenanceStatus.mockRejectedValue(new Error("Maintenance record not found"));

      await maintenanceController.updateMaintenanceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteMaintenance", () => {
    it("should delete maintenance record successfully", async () => {
      req.params.id = "maint123";
      maintenanceService.deleteMaintenance.mockResolvedValue();

      await maintenanceController.deleteMaintenance(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if maintenance not found", async () => {
      req.params.id = "nonexistent";
      maintenanceService.deleteMaintenance.mockRejectedValue(new Error("Maintenance record not found"));

      await maintenanceController.deleteMaintenance(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("checkMaintenanceAlerts", () => {
    it("should check maintenance alerts successfully", async () => {
      req.params.vehicleId = "truck123";
      const mockAlerts = [{ type: "oil-change", dueKm: 5000 }];
      maintenanceService.checkMaintenanceAlerts.mockResolvedValue(mockAlerts);

      await maintenanceController.checkMaintenanceAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 on error", async () => {
      req.params.vehicleId = "truck123";
      maintenanceService.checkMaintenanceAlerts.mockRejectedValue(new Error("Error"));

      await maintenanceController.checkMaintenanceAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("checkAllMaintenanceAlerts", () => {
    it("should check all maintenance alerts successfully", async () => {
      const mockAlerts = [{ vehicleId: "truck123", alerts: [] }];
      maintenanceService.checkAllMaintenanceAlerts.mockResolvedValue(mockAlerts);

      await maintenanceController.checkAllMaintenanceAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      maintenanceService.checkAllMaintenanceAlerts.mockRejectedValue(new Error("Error"));

      await maintenanceController.checkAllMaintenanceAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getMaintenanceStatistics", () => {
    it("should get maintenance statistics successfully", async () => {
      const mockStats = { total: 100, completed: 80, pending: 20 };
      maintenanceService.getMaintenanceStatistics.mockResolvedValue(mockStats);

      await maintenanceController.getMaintenanceStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      maintenanceService.getMaintenanceStatistics.mockRejectedValue(new Error("Error"));

      await maintenanceController.getMaintenanceStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
