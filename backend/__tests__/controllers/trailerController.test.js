import { jest } from "@jest/globals";
import * as trailerController from "../../controllers/trailerController.js";
import * as trailerService from "../../services/trailerService.js";
import * as trailerValidator from "../../validators/trailerValidator.js";

jest.mock("../../services/trailerService.js");
jest.mock("../../validators/trailerValidator.js");

describe("Trailer Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("createTrailer", () => {
    const validTrailerData = {
      matricule: "TRL-123",
      type: "refrigerated",
      maxLoad: 25000,
      status: "available",
    };

    it("should create trailer successfully", async () => {
      req.body = validTrailerData;
      trailerValidator.validateTrailer.mockReturnValue({ error: null });
      trailerService.getTrailerByMatricule.mockResolvedValue(null);
      trailerService.createTrailer.mockResolvedValue({
        _id: "trailer123",
        ...validTrailerData,
      });

      await trailerController.createTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Trailer created successfully",
        trailer: expect.objectContaining({ _id: "trailer123" }),
      });
    });

    it("should return 400 if validation fails", async () => {
      req.body = validTrailerData;
      trailerValidator.validateTrailer.mockReturnValue({
        error: { details: [{ message: "Validation error" }] },
      });

      await trailerController.createTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if matricule already exists", async () => {
      req.body = validTrailerData;
      trailerValidator.validateTrailer.mockReturnValue({ error: null });
      trailerService.getTrailerByMatricule.mockResolvedValue({
        matricule: "TRL-123",
      });

      await trailerController.createTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getAllTrailers", () => {
    it("should get all trailers with filters", async () => {
      req.query = { status: "available", type: "refrigerated" };
      const mockTrailers = [
        { _id: "1", matricule: "TRL-1", type: "refrigerated" },
        { _id: "2", matricule: "TRL-2", type: "refrigerated" },
      ];
      trailerService.getAllTrailers.mockResolvedValue(mockTrailers);

      await trailerController.getAllTrailers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        trailers: mockTrailers,
      });
    });

    it("should return 500 on error", async () => {
      trailerService.getAllTrailers.mockRejectedValue(new Error("Error"));

      await trailerController.getAllTrailers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getTrailerById", () => {
    it("should get trailer by id successfully", async () => {
      req.params.id = "trailer123";
      const mockTrailer = { _id: "trailer123", matricule: "TRL-123" };
      trailerService.getTrailerById.mockResolvedValue(mockTrailer);

      await trailerController.getTrailerById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTrailer);
    });

    it("should return 404 if trailer not found", async () => {
      req.params.id = "nonexistent";
      trailerService.getTrailerById.mockResolvedValue(null);

      await trailerController.getTrailerById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateTrailer", () => {
    it("should update trailer successfully", async () => {
      req.params.id = "trailer123";
      req.body = { status: "in-use" };
      trailerValidator.validateTrailerUpdate.mockReturnValue({ error: null });
      trailerService.getTrailerById.mockResolvedValue({ _id: "trailer123" });
      trailerService.updateTrailer.mockResolvedValue({
        _id: "trailer123",
        status: "in-use",
      });

      await trailerController.updateTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "trailer123";
      req.body = { status: "invalid" };
      trailerValidator.validateTrailerUpdate.mockReturnValue({
        error: { details: [{ message: "Invalid status" }] },
      });

      await trailerController.updateTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if trailer not found", async () => {
      req.params.id = "nonexistent";
      req.body = { status: "in-use" };
      trailerValidator.validateTrailerUpdate.mockReturnValue({ error: null });
      trailerService.getTrailerById.mockResolvedValue(null);

      await trailerController.updateTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteTrailer", () => {
    it("should delete trailer successfully", async () => {
      req.params.id = "trailer123";
      trailerService.getTrailerById.mockResolvedValue({ _id: "trailer123" });
      trailerService.deleteTrailer.mockResolvedValue();

      await trailerController.deleteTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if trailer not found", async () => {
      req.params.id = "nonexistent";
      trailerService.getTrailerById.mockResolvedValue(null);

      await trailerController.deleteTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateTrailerStatus", () => {
    it("should update trailer status successfully", async () => {
      req.params.id = "trailer123";
      req.body = { status: "maintenance" };
      trailerValidator.validateStatusUpdate.mockReturnValue({ error: null });
      trailerService.getTrailerById.mockResolvedValue({ _id: "trailer123" });
      trailerService.updateTrailerStatus.mockResolvedValue({
        _id: "trailer123",
        status: "maintenance",
      });

      await trailerController.updateTrailerStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if validation fails", async () => {
      req.params.id = "trailer123";
      req.body = { status: "invalid" };
      trailerValidator.validateStatusUpdate.mockReturnValue({
        error: { details: [{ message: "Invalid status" }] },
      });

      await trailerController.updateTrailerStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
