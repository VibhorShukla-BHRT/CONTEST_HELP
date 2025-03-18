import express from "express"
import { getDetails, upcomingContest } from "../controllers/leetcode.controller";

const  leetcodeRouter = express.Router();

leetcodeRouter.get('/details', getDetails);
leetcodeRouter.get('/upcoming-contests',upcomingContest);

export default leetcodeRouter;