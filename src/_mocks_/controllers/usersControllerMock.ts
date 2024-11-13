import { Request, Response } from 'express';
import Joi from 'joi';
import bcrypt from "bcrypt";

// Define interfaces
interface UserData {
    id: string;
    username: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

// Mock database
let users: UserData[] = [
    {
        id: "1",
        username: "john_doe",
        email: "john@example.com",
        password: "$2b$10$YourHashedPasswordHere" // pre-hashed password
    }
];

// Validation schemas
const userDataSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginDataSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).messages({
    'string.empty': 'Email and password are required',
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email and password are required'
});

const idSchema = Joi.object({
    id: Joi.string().pattern(/^\d+$/).required().messages({
        'string.empty': 'User ID is required',
        'string.pattern.base': 'User ID must be a numeric value',
        'any.required': 'User ID is required'
    })
});

// Create a new user
export const createUser = async (req: Request<{}, {}, UserData>, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        const { error } = await userDataSchema.validateAsync({ username, email, password });
        
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: (users.length + 1).toString(),
            username,
            email,
            password: hashedPassword
        };

        users.push(newUser);
        
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get all users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Remove passwords from response
        const sanitizedUsers = users.map(({ password, ...rest }) => rest);
        res.status(200).json(sanitizedUsers);
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
            res.status(400).json({ error: error.message });
            return;
        }

        const user = users.find(u => u.id === id);
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword);
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
        const updates = req.body;

        const { error: idError } = await idSchema.validateAsync({ id });
        if (idError) {
            res.status(400).json({ error: idError.message });
            return;
        }

        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // If password is being updated, hash it
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        // Update user
        users[userIndex] = {
            ...users[userIndex],
            ...updates
        };

        // Remove password from response
        const { password, ...userWithoutPassword } = users[userIndex];
        res.status(200).json(userWithoutPassword);
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
            res.status(400).json({ error: error.message });
            return;
        }

        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        users = users.filter(u => u.id !== id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Login user
export const loginUser = async (req: Request<{}, {}, LoginData>, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        const { error } = await loginDataSchema.validateAsync({ email, password });
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        // In a real application, you would generate a JWT token here
        const mockToken = "mock-jwt-token";
        
        res.status(200).json({ user: user, token: mockToken });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};