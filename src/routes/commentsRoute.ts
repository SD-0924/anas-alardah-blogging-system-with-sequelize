import express from "express";
import { createCommentsTable, createComment, getCommentsByPostId} from "../controllers/commentsController.js";
import { verifyToken } from "../middleware/token.js";

const commentsRouter = express.Router();

commentsRouter.get("/createCommentsTable", createCommentsTable);
commentsRouter.post("/createComment", verifyToken ,createComment);
commentsRouter.get("/getAllComments/:postId", getCommentsByPostId);

export default commentsRouter;