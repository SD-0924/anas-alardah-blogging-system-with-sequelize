import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { Users } from '../models/usersModel.js';

// Define an interface for user data
interface UserData {
    username: string;
    email: string;
    password: string;
}

// Create users table
export const createUsersTable = async (req: Request, res: Response): Promise<void> => {
    try {
        await Users.sync({ alter: true });
        res.status(200).json({ message: 'Users table created successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Create a new user
export const createUser = async (req: Request<{}, {}, UserData>, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        const user = await Users.create({ username, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get user by ID
export const getUserById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await Users.findByPk(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Update user by ID
export const updateUser = async (req: Request<{ id: string }, {}, Partial<UserData>>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        const user = await Users.findByPk(id) as Model<any, any> & Partial<UserData>;
        
        if (user) {
            user.username = username !== undefined ? username : user.username;
            user.email = email !== undefined ? email : user.email;
            user.password = password !== undefined ? password : user.password;
            await user.save();
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Delete user by ID
export const deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        const user = await Users.findByPk(id);
        
        if (user) { 
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};