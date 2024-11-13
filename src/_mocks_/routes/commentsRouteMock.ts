import express from "express";
import { createComment, getCommentsByPostId} from "../controllers/commentsControllerMock.js";

const commentsRouter = express.Router();

commentsRouter.post("/createComment", createComment);
commentsRouter.get("/getAllComments/:postId", getCommentsByPostId);

export default commentsRouter;