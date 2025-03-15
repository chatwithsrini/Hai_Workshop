import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
    // Authentication Methods
    async login(req: Request, res: Response) {
        try {
            const { email, password, role } = req.body;
            if (!email || !password || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const authResponse = await UserService.login(email, password, role);
            res.status(200).json(authResponse);
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }

    async signup(req: Request, res: Response) {
        try {
            const { email, password, name, role } = req.body;
            if (!email || !password || !name || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const authResponse = await UserService.signup({ email, password, name, role });
            res.status(201).json(authResponse);
        } catch (error) {
            console.error('Signup error:', error);
            res.status(400).json({ error: 'Failed to create user' });
        }
    }

    async validateSession(req: Request, res: Response) {
        try {
            // The user object is attached by the auth middleware
            if (!req.user) {
                return res.status(401).json({ error: 'Invalid session' });
            }

            const user = await UserService.getUserById(req.user.id);
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Return the same format as login/signup
            res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token: req.headers.authorization?.split(' ')[1] // Return the same token
            });
        } catch (error) {
            console.error('Session validation error:', error);
            res.status(401).json({ error: 'Invalid session' });
        }
    }

    // User Management Methods
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await UserService.getUserById(userId);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error retrieving user:', error);
            res.status(500).json({ error: 'Failed to retrieve user' });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            if (!userData.email || !userData.password || !userData.name || !userData.role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const newUser = await UserService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const userData = req.body;
            const updatedUser = await UserService.updateUser(userId, userData);
            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const deleted = await UserService.deleteUser(userId);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }

    // Admin Specific Methods
    async getAllUsersAdmin(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsersWithDetails();
            res.status(200).json(users);
        } catch (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    }

    async updateUserRole(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const { role } = req.body;
            if (!role || !['user', 'admin'].includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }
            const updatedUser = await UserService.updateUserRole(userId, role);
            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            res.status(500).json({ error: 'Failed to update user role' });
        }
    }
}

export default new UserController();
