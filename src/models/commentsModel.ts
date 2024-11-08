import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Posts } from "./postsModel.js";
import { Users } from "./usersModel.js";

// Create a COMMENTS Schema
export const Comments = sequelize.define(
    'comments',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Posts, // References the Posts model
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Users, // References the Users model
                key: 'id'
            }
        }
    },
    {
        timestamps: true // Enables createdAt and updatedAt automatically
    }
);


Comments.belongsTo(Users, {
    foreignKey: 'userId',
    as: 'user',
});

Comments.belongsTo(Posts, {
    foreignKey: 'postId',
    as: 'post',
});

Users.hasMany(Comments, {
    foreignKey: 'userId',
    as: 'comments',
});

Posts.hasMany(Comments, {
    foreignKey: 'postId',
    as: 'comments',
});
