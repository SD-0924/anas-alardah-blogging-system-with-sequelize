import { Request, Response } from 'express';
import Joi from 'joi';

// Define an interface for the category data
interface CategoryData {
    description: string;
    postId: number;
}

// Validation schema for category data
const categoryDataSchema = Joi.object({
    description: Joi.string().required(),
    postId: Joi.number().required(),
});

// Mock database for categories
let categories = [
    {
        id: "1",
        description: "Category 1",
        postId: 1,
    },
];

// Create a new category for a post by ID
export const createCategory = async (req: Request<{}, {}, CategoryData>, res: Response): Promise<void> => {
    try {
        const { description, postId } = req.body;
        const { error } = await categoryDataSchema.validateAsync({ description, postId });
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Mocking the database insertion
        const category = { id: (categories.length + 1).toString(), description, postId };
        categories.push(category);
        const postCategories = { postId, categoryId: category.id };
        res.status(201).json({ category, postCategories });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get categories for a specific post by ID
export const getCategoriesByPostId = async (req: Request<{ postId: string }>, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        if (!postId || isNaN(Number(postId))) {
            return res.status(400).json({ error: "Invalid post ID format" });
        }

        const categoriesList = categories.filter(category => category.postId === Number(postId));

        if (!categoriesList || categoriesList.length === 0) {
            return res.status(404).json({ error: "Categories not found" });
        }

        res.status(200).json(categoriesList);
    } catch (error) {
        console.error('Error getting categories by post ID:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
