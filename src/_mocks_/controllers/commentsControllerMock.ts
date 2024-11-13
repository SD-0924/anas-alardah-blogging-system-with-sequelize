import { Request, Response } from 'express';
import Joi from 'joi';

// Define a type for the comment data
interface CommentData {
    content: string;
    postId: number;
    userId: number;
}

// Validation schema for comment data
const commentDataSchema = Joi.object({
    content: Joi.string().required(),
    postId: Joi.number().required(),
    userId: Joi.number().required(),
});

//Mock database for comments
let comments = [
    {
        id: "1",
        content: "This is the content of the first comment",
        postId: 1,
        userId: 1,
    },
];


// Create a new comment for a post by ID
export const createComment = async (req: Request<{}, {}, CommentData>, res: Response): Promise<void> => {
    try {
        const { content, postId, userId } = req.body;
        const { error } = await commentDataSchema.validateAsync({ content, postId, userId });
        if (error) {
            return res.status(400).json({ error: error.message, message: 'Comment content, post ID, and user ID are required' });
        }

        // Mocking the database insertion
        const newComment = { id: (comments.length + 1).toString(), content, postId, userId };
        comments.push(newComment);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get comments for a specific post by ID
export const getCommentsByPostId = async (req: Request<{ postId: string }>, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const commentsForPost = comments.filter(comment => comment.postId === Number(postId));
        if (!commentsForPost || commentsForPost.length === 0) {
            res.status(404).json({ error: 'No comments found for this post' });
        } else {
            res.status(200).json(commentsForPost);
        }
    } catch (error) {
        console.error('Error getting comments by post ID:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};
