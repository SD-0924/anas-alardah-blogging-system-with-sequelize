import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// Create a CATEGORIES Schema
export const Categories = sequelize.define(
    'categories',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);


