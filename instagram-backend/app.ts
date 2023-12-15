import "dotenv/config";
import express from "express";
import errorHandler from "./security/middleware/error.middleware";
import signRouter from "./security/routers/sign";
import postRouter from "./security/routers/post";
import userRouter from "./security/routers/user";
import tagRouter from "./security/routers/tag";
import cors from 'cors'


const app = express();

app.use(cors())
app.use(signRouter);
app.use(postRouter);
app.use(userRouter);
app.use(tagRouter)
app.use(errorHandler)

app.use(errorHandler);
app.listen(8080);
