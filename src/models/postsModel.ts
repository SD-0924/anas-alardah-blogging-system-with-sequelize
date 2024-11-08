import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Users } from "./usersModel.js";
import { Categories } from "./categoriesModel.js";

// Create a POSTS Schema
export const Posts = sequelize.define(
    'posts',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: Users,
              key: 'id',
            },
        }
    },
    {
        timestamps: true, // Enables createdAt and updatedAt automatically
    }
);

Posts.belongsTo(Users, {
    foreignKey: 'userId',
    as: 'user',
});
  
Users.hasMany(Posts, {
    foreignKey: 'userId',
    as: 'posts',
});

// In Post model
Posts.belongsToMany(Categories, { through: 'posts_categories' });

// In Categories model
Categories.belongsToMany(Posts, { through: 'posts_categories' });


