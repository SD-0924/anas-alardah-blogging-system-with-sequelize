import { Request, Response } from 'express';
import Joi from 'joi';

// Mock database for posts
let posts = [
    {
        id: "1",
        title: "First Post",
        content: "This is the content of the first post",
        userId: 1,
    },
];

// Validation schemas
const postDataSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    userId: Joi.number().required(),
});

const updatePostSchema = Joi.object({
    title: Joi.string(),
    content: Joi.string(),
});

const idSchema = Joi.object({
    id: Joi.string().pattern(/^\d+$/).required().messages({
        'string.empty': 'Post ID is required',
        'string.pattern.base': 'Post ID must be a numeric value',
        'any.required': 'Post ID is required',
    }),
});

// Create a new post (mocked)
export const createPost = async (req: Request<{}, {}, { title: string; content: string; userId: number }>, res: Response): Promise<void> => {
    try {
        const { title, content, userId } = req.body;
        const { error } = await postDataSchema.validateAsync({ title, content, userId });
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Mocking the database insertion
        const newPost = { id: (posts.length + 1).toString(), title, content, userId };
        posts.push(newPost);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get all posts (mocked)
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        // Mocking fetching posts from DB
        if (posts.length === 0) {
            return res.status(404).json({ error: 'No posts found' });
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get post by ID (mocked)
export const getPostById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { error } = await idSchema.validateAsync({ id });
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const post = posts.find(p => p.id === id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Update post by ID (mocked)
export const updatePost = async (req: Request<{ id: string }, {}, Partial<{ title: string; content: string }>>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const { error: idError } = await idSchema.validateAsync({ id });
        if (idError) {
            return res.status(400).json({ error: idError.message });
        }

        const postIndex = posts.findIndex(p => p.id === id);
        if (postIndex === -1) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const updatedPost = { ...posts[postIndex], title: title ?? posts[postIndex].title, content: content ?? posts[postIndex].content };
        posts[postIndex] = updatedPost;

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Delete post by ID (mocked)
export const deletePost = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { error } = await idSchema.validateAsync({ id });
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const postIndex = posts.findIndex(p => p.id === id);
        if (postIndex === -1) {
            return res.status(404).json({ error: 'Post not found' });
        }

        posts = posts.filter(p => p.id !== id);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
