import express from "express";
import { createUser, createUsersTable, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.get("/createUsersTable", createUsersTable);

usersRouter.post("/createUser", createUser);
usersRouter.get("/getAllUsers", getAllUsers);
usersRouter.get("/getUserById/:id", getUserById);
usersRouter.put("/updateUser/:id", updateUser);
usersRouter.delete("/deleteUser/:id", deleteUser);

export default usersRouter;
    