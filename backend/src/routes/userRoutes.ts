import express from 'express';
import UserController from '../controllers/UserController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public authentication routes
router.post('/auth/login', UserController.login);
router.post('/auth/signup', UserController.signup);

// Protected authentication routes
router.get('/auth/validate', authenticateToken, UserController.validateSession);

// Protected user management routes
router.get('/users', authenticateToken, UserController.getAllUsers);
router.get('/users/:id', authenticateToken, UserController.getUserById);
router.post('/users', authenticateToken, UserController.createUser);
router.put('/users/:id', authenticateToken, UserController.updateUser);
router.delete('/users/:id', authenticateToken, UserController.deleteUser);

// Protected admin specific routes
router.get('/admin/users', authenticateToken, UserController.getAllUsersAdmin);
router.put('/admin/users/:id/role', authenticateToken, UserController.updateUserRole);

export default router;
