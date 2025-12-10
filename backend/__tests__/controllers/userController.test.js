import { jest } from '@jest/globals';
import * as userController from '../../controllers/userController.js';
import * as authService from '../../services/authService.js';
import * as authValidator from '../../validators/authValidator.js';

jest.mock('../../services/authService.js');
jest.mock('../../validators/authValidator.js');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should get all users successfully', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' }
      ];
      authService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 500 on error', async () => {
      authService.getAllUsers.mockRejectedValue(new Error('Database error'));

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getPendingChauffeurs', () => {
    it('should get pending chauffeurs successfully', async () => {
      const mockPending = [
        { _id: '1', name: 'Driver 1', accountStatus: 'pending' }
      ];
      authService.getPendingChauffeurs.mockResolvedValue(mockPending);

      await userController.getPendingChauffeurs(req, res);

      expect(res.json).toHaveBeenCalledWith(mockPending);
    });

    it('should return 500 on error', async () => {
      authService.getPendingChauffeurs.mockRejectedValue(new Error('Error'));

      await userController.getPendingChauffeurs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateAccountStatus', () => {
    it('should update account status successfully', async () => {
      req.params.id = 'user123';
      req.body = { accountStatus: 'approved' };
      const mockUser = { _id: 'user123', accountStatus: 'approved' };
      authValidator.validateApproval.mockReturnValue({ error: null });
      authService.updateAccountStatus.mockResolvedValue(mockUser);

      await userController.updateAccountStatus(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Account approved successfully',
        user: mockUser
      });
    });

    it('should return 400 if validation fails', async () => {
      req.params.id = 'user123';
      req.body = { accountStatus: 'invalid' };
      authValidator.validateApproval.mockReturnValue({
        error: { details: [{ message: 'Invalid status' }] }
      });

      await userController.updateAccountStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 'nonexistent';
      req.body = { accountStatus: 'approved' };
      authValidator.validateApproval.mockReturnValue({ error: null });
      authService.updateAccountStatus.mockResolvedValue(null);

      await userController.updateAccountStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getUserById', () => {
    it('should get user by id successfully', async () => {
      req.params.id = 'user123';
      const mockUser = { _id: 'user123', name: 'John Doe' };
      authService.findUserById.mockResolvedValue(mockUser);

      await userController.getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 'nonexistent';
      authService.findUserById.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      req.params.id = 'user123';
      const mockUser = { deleteOne: jest.fn().mockResolvedValue() };
      authService.findUserById.mockResolvedValue(mockUser);

      await userController.deleteUser(req, res);

      expect(mockUser.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 'nonexistent';
      authService.findUserById.mockResolvedValue(null);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createAdminUser', () => {
    it('should create admin user successfully', async () => {
      req.body = { name: 'Admin', email: 'admin@example.com', password: 'pass123' };
      authValidator.validateAdminCreation.mockReturnValue({ error: null });
      authService.findUserByEmail.mockResolvedValue(null);
      authService.createUser.mockResolvedValue({
        _id: 'admin123',
        name: 'Admin',
        role: 'admin'
      });

      await userController.createAdminUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if validation fails', async () => {
      req.body = { email: 'invalid' };
      authValidator.validateAdminCreation.mockReturnValue({
        error: { details: [{ message: 'Validation error' }] }
      });

      await userController.createAdminUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if user already exists', async () => {
      req.body = { email: 'existing@example.com' };
      authValidator.validateAdminCreation.mockReturnValue({ error: null });
      authService.findUserByEmail.mockResolvedValue({ email: 'existing@example.com' });

      await userController.createAdminUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
