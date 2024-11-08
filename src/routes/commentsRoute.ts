import express from "express";
import { createCommentsTable, createComment, getCommentsByPostId} from "../controllers/commentsController.js";

const commentsRouter = express.Router();

commentsRouter.get("/createCommentsTable", createCommentsTable);
commentsRouter.post("/createComment", createComment);
commentsRouter.get("/getAllComments/:postId", getCommentsByPostId);

export default commentsRouter;