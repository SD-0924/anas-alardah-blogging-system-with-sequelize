import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Categories } from "./categoriesModel.js";
import { Posts } from "./postsModel.js";

//Create PostCategories Schema
export const PostsCategories = sequelize.define(
    'posts_categories',
    {
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id'
            }
        }
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

Posts.belongsToMany(Categories, { through: PostsCategories, foreignKey: 'postId' });
Categories.belongsToMany(Posts, { through: PostsCategories, foreignKey: 'categoryId' });