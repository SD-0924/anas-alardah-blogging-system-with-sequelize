import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { Comments } from '../models/commentsModel.js';

// Define a type for the comment data
interface CommentData {
    content: string;
    postId: number;
    userId: number;
}

// Create comments table
export const createCommentsTable = async (req: Request, res: Response): Promise<void> => {
    try {
        await Comments.sync({ alter: true });
        console.log('Comments table created successfully');
        res.status(200).json({ message: 'Comments table created successfully' });
    } catch (error) {
        console.error('Error creating Comments table:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

// Create a new comment for a post by ID
export const createComment = async (req: Request<{}, {}, CommentData>, res: Response): Promise<void> => {
    try {
        const { content, postId, userId } = req.body;
        const comment = await Comments.create({ content, postId, userId });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get comments for a specific post by ID
export const getCommentsByPostId = async (req: Request<{ postId: string }>, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const comments = await Comments.findAll({ where: { postId } });

        if (!comments || comments.length === 0) {
            res.status(404).json({ error: 'No comments found for this post' });
        } else {
            res.status(200).json(comments);
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};