import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { Users } from '../models/usersModel.js';
import Joi from 'joi';
import bcrypt from "bcrypt";

// Define an interface for user data
interface UserData {
    username: string;
    email: string;
    password: string;
}

// Validation schema for user data
const userDataSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Validation schema for user ID
const idSchema = Joi.object({
    id: Joi.string().pattern(/^\d+$/).required().messages({
        'string.empty': 'User ID is required',
        'string.pattern.base': 'User ID must be a numeric value',
        'any.required': 'User ID is required'
    })
});

//TODO: Validation schema for user login


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
        const { error } = await userDataSchema.validateAsync({ username, email, password });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
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
        const { error } = await idSchema.validateAsync({ id });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
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

        const { error } = await userDataSchema.validateAsync({ username, email, password });
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const { error: idError } = await idSchema.validateAsync({ id });
        if (idError) {
            return res.status(400).json({ error: idError.message });
        }

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

        const { error } = await idSchema.validateAsync({ id });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
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

//Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.get('password') as string);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.status(200).json({ user, token: req.token });
    }
    catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
