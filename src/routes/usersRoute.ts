import express from "express";
import { createUser, createUsersTable, getAllUsers, getUserById, updateUser, deleteUser, loginUser } from "../controllers/usersController.js";
import { generateToken, verifyToken } from "../middleware/token.js";
const usersRouter = express.Router();

usersRouter.get("/createUsersTable", createUsersTable);

usersRouter.post("/createUser", createUser);
usersRouter.get("/getAllUsers", getAllUsers); //should be protected by an admin token?
usersRouter.get("/getUserById/:id", verifyToken ,getUserById);
usersRouter.put("/updateUser/:id", verifyToken , updateUser);
usersRouter.delete("/deleteUser/:id", verifyToken ,deleteUser);
usersRouter.get("/login", generateToken ,loginUser);

export default usersRouter;
    