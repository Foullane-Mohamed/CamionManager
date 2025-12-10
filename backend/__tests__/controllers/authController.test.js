import { jest } from '@jest/globals';
import * as authController from '../../controllers/authController.js';
import * as authService from '../../services/authService.js';
import * as authValidator from '../../validators/authValidator.js';

jest.mock('../../services/authService.js');
jest.mock('../../validators/authValidator.js');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const validUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phoneNumber: '1234567890',
      nationalId: 'ID12345',
      licenseNumber: 'LIC123',
      licenseType: 'B',
      address: '123 Main St',
      dateOfBirth: '1990-01-01'
    };

    it('should register user successfully', async () => {
      req.body = validUserData;
      authValidator.validateRegister.mockReturnValue({ error: null });
      authService.findUserByEmail.mockResolvedValue(null);
      authService.createUser.mockResolvedValue({
        _id: 'user123',
        ...validUserData,
        role: 'chauffeur',
        accountStatus: 'pending'
      });
      authService.generateAccessToken.mockReturnValue('accessToken');
      authService.generateRefreshToken.mockReturnValue('refreshToken');
      authService.updateRefreshToken.mockResolvedValue();

      await authController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'user123',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken'
      }));
    });

    it('should return 400 if validation fails', async () => {
      req.body = validUserData;
      authValidator.validateRegister.mockReturnValue({
        error: { details: [{ message: 'Validation error' }] }
      });

      await authController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
    });

    it('should return 400 if user already exists', async () => {
      req.body = validUserData;
      authValidator.validateRegister.mockReturnValue({ error: null });
      authService.findUserByEmail.mockResolvedValue({ email: 'john@example.com' });

      await authController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('should return 500 on error', async () => {
      req.body = validUserData;
      authValidator.validateRegister.mockReturnValue({ error: null });
      authService.findUserByEmail.mockRejectedValue(new Error('Database error'));

      await authController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      req.body = { email: 'john@example.com', password: 'password123' };
      const mockUser = {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        accountStatus: 'approved',
        matchPassword: jest.fn().mockResolvedValue(true)
      };
      authValidator.validateLogin.mockReturnValue({ error: null });
      authService.findUserByEmail.mockResolvedValue(mockUser);
      authService.generateAccessToken.mockReturnValue('accessToken');
      authService.generateRefreshToken.mockReturnValue('refreshToken');
      authService.updateRefreshToken.mockResolvedValue();

      await authController.loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'user123',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken'
      }));
    });

    it('should return 400 if validation fails', async () => {
      req.body = { email: 'invalid' };
      authValidator.validateLogin.mockReturnValue({
        error: { details: [{ message: 'Invalid credentials' }] }
      });

      await authController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 403 if chauffeur account not approved', async () => {
      req.body = { email: 'john@example.com', password: 'password123' };
      const mockUser = {
        role: 'chauffeur',
        accountStatus: 'pending',
        matchPassword: jest.fn().mockResolvedValue(true)
      };
      authValidator.validateLogin.mockReturnValue({ error: null });
      authService.findUserByEmail.mockResolvedValue(mockUser);

      await authController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 401 if credentials invalid', async () => {
      req.body = { email: 'john@example.com', password: 'wrong' };
      authValidator.validateLogin.mockReturnValue({ error: null });
      authService.findUserByEmail.mockResolvedValue(null);

      await authController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
