import { Model } from "sequelize";
import { Users } from "../models/usersModel.js";

export const createUsersTable = async (req, res) => {
    try {
        await Users.sync({ alter: true });
        res.status(200).json({ message: 'Users table created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await Users.create({ username, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.findByPk(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await Users.findByPk(id) as Model<any, any> & { username: string, email: string, password: string };
        if (user) {
            user.username = username || user.username;
            user.email = email || user.email;
            user.password = password || user.password;
            await user.save();
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
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
        res.status(500).json({ error: error.message });
    }
};