import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { IUser, IAuthResponse, ILoginCredentials, ISignupCredentials } from '../models/IUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in environment variables

class UserService {
    private async generateAuthToken(user: Omit<IUser, 'password'>): Promise<string> {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // Authentication Methods
    async login(email: string, password: string, role: 'user' | 'admin'): Promise<IAuthResponse> {
        const db = getDB();
        const collection = db.collection('users');

        const user = await collection.findOne({ email, role });
        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await this.comparePasswords(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        const userWithoutPassword = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            dateCreated: user.dateCreated,
            dateUpdated: user.dateUpdated
        };

        const token = await this.generateAuthToken(userWithoutPassword);

        return {
            user: userWithoutPassword,
            token
        };
    }

    async signup(credentials: ISignupCredentials): Promise<IAuthResponse> {
        const db = getDB();
        const collection = db.collection('users');

        // Check if user already exists
        const existingUser = await collection.findOne({ email: credentials.email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await this.hashPassword(credentials.password);

        const now = new Date();
        const result = await collection.insertOne({
            name: credentials.name,
            email: credentials.email,
            password: hashedPassword,
            role: credentials.role,
            dateCreated: now,
            dateUpdated: now
        });

        const userWithoutPassword = {
            id: result.insertedId.toString(),
            name: credentials.name,
            email: credentials.email,
            role: credentials.role,
            dateCreated: now,
            dateUpdated: now
        };

        const token = await this.generateAuthToken(userWithoutPassword);

        return {
            user: userWithoutPassword,
            token
        };
    }

    // User Management Methods
    async getAllUsers(): Promise<Omit<IUser, 'password'>[]> {
        const db = getDB();
        const collection = db.collection('users');

        const users = await collection.find({}).toArray();
        return users.map(user => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            dateCreated: user.dateCreated,
            dateUpdated: user.dateUpdated
        }));
    }

    async getUserById(userId: string): Promise<Omit<IUser, 'password'> | null> {
        const db = getDB();
        const collection = db.collection('users');

        const user = await collection.findOne({ _id: new ObjectId(userId) });
        if (!user) return null;

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            dateCreated: user.dateCreated,
            dateUpdated: user.dateUpdated
        };
    }

    async createUser(userData: Omit<IUser, 'id' | 'dateCreated' | 'dateUpdated'>): Promise<Omit<IUser, 'password'>> {
        const db = getDB();
        const collection = db.collection('users');

        const hashedPassword = await this.hashPassword(userData.password);
        const now = new Date();

        const result = await collection.insertOne({
            ...userData,
            password: hashedPassword,
            dateCreated: now,
            dateUpdated: now
        });

        return {
            id: result.insertedId.toString(),
            name: userData.name,
            email: userData.email,
            role: userData.role,
            dateCreated: now,
            dateUpdated: now
        };
    }

    async updateUser(userId: string, userData: Partial<Omit<IUser, 'id' | 'password'>>): Promise<Omit<IUser, 'password'> | null> {
        const db = getDB();
        const collection = db.collection('users');

        const updateData = {
            ...userData,
            dateUpdated: new Date()
        };

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) return null;

        return {
            id: result._id.toString(),
            name: result.name,
            email: result.email,
            role: result.role,
            dateCreated: result.dateCreated,
            dateUpdated: result.dateUpdated
        };
    }

    async deleteUser(userId: string): Promise<boolean> {
        const db = getDB();
        const collection = db.collection('users');

        const result = await collection.deleteOne({ _id: new ObjectId(userId) });
        return result.deletedCount === 1;
    }

    // Admin Specific Methods
    async getAllUsersWithDetails(): Promise<Omit<IUser, 'password'>[]> {
        return this.getAllUsers(); // For now, same as getAllUsers but could include more details in the future
    }

    async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<Omit<IUser, 'password'> | null> {
        return this.updateUser(userId, { role });
    }
}

export default new UserService();
