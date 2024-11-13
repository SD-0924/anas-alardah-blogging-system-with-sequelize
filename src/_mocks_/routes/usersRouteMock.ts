import express from "express";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser } from "../controllers/usersControllerMock.js";
const usersRouter = express.Router();


usersRouter.post("/createUser", createUser);
usersRouter.get("/getAllUsers", getAllUsers);
usersRouter.get("/getUserById/:id" ,getUserById);
usersRouter.put("/updateUser/:id" , updateUser);
usersRouter.delete("/deleteUser/:id" ,deleteUser);
usersRouter.get("/login",loginUser);

export default usersRouter;
    