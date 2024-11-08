import express from "express";
import usersRouter from "./routes/usersRoute.js";
import postsRouter from "./routes/postsRoute.js";
import commentsRouter from "./routes/commentsRoute.js";
import categoriesRouter from "./routes/categoriesRoute.js";
import postsCategoriesRouter from "./routes/postsCategoriesRoute.js";
import { connectToDB, closeDb } from "./config/db.js";
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/categories", categoriesRouter);
app.use("/postsCategories", postsCategoriesRouter);

app.listen(port, async () => {
    await connectToDB();
    console.log(`Server is running at http://localhost:${port}`);
});