import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
//import .env
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req: Request, res: Response, next: Function): void => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(403).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ error: 'No token provided', message: 'Unauthorized' });
        }

        jwt.verify(token, 'key1', (err, decoded: any) => {
            if (err || !decoded) {
                return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
            }

            req.userId = decoded.id; // Save user ID from token
            next(); // Proceed to the next middleware or route handler
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const generateToken = (req, res, next) => {
    const userId = req.body.id;

    //Verify the user credentials and generate a token
    const token = jwt.sign({ id: userId }, 'key1', { expiresIn: '1h' });
    req.token = token;
    next();
};
