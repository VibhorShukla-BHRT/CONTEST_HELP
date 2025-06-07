import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import connectDatabase from "./db/conn.db";
import cookieParser from "cookie-parser";
import dotevn from "dotenv";
import leetcodeRouter from "./routes/leetcode.route";
import cfRouter from "./routes/codeforces.route";
import ccRouter from "./routes/codechef.route";
dotevn.config();
connectDatabase();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/api/2025',(req:Request,res:Response)=>{
    res.send("SERVER RESPONDING");
})
app.use('/api/leetcode',leetcodeRouter);
app.use('/api/codeforces',cfRouter);
app.use('/api/codechef',ccRouter);
// app.use('/ap1/codeforces',);
// app.use('/api/codechef',);
app.listen(PORT,()=>{
    console.log("Server Running at port 5000");
})