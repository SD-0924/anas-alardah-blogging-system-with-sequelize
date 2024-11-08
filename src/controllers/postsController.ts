import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { Posts } from '../models/postsModel.js';
import { Users } from '../models/usersModel.js';
import { Comments } from '../models/commentsModel.js';
import { Categories } from '../models/categoriesModel.js';

// Define an interface for the post data
interface PostData {
    title: string;
    content: string;
    userId: number;
}

// Create posts table
export const createPostsTable = async (req: Request, res: Response): Promise<void> => {
    try {
        await Posts.sync({ alter: true });
        console.log('Posts table created successfully');
        res.status(200).json({ message: 'Posts table created successfully' });
    } catch (error) {
        console.error('Error creating Posts table:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

// Create a new post
export const createPost = async (req: Request<{}, {}, PostData>, res: Response): Promise<void> => {
    try {
        const { title, content, userId } = req.body;
        const post = await Posts.create({ title, content, userId });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get all posts with associated users, categories, and comments
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Posts.findAll({
            include: [
                { model: Users, as: 'user' },
                { model: Categories, as: 'categories' },
                { model: Comments, as: 'comments' },
            ],
        });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: 'No posts found' });
        }

        res.status(200).json(posts);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

// Get post by ID with associated users, categories, and comments
export const getPostById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const post = await Posts.findByPk(id, {
            include: [
                { model: Users, as: 'user' },
                { model: Categories, as: 'categories' },
                { model: Comments, as: 'comments' },
            ],
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error getting post by ID:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

// Update post by ID
export const updatePost = async (req: Request<{ id: string }, {}, Partial<PostData>>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const post = await Posts.findByPk(id) as Model<any, any> & Partial<PostData>;
        
        if (post) {
            post.title = title !== undefined ? title : post.title;
            post.content = content !== undefined ? content : post.content;
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Delete post by ID
export const deletePost = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        const post = await Posts.findByPk(id);
        
        if (post) {
            await post.destroy();
            res.status(200).json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};