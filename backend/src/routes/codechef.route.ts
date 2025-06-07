import express from "express"
import { getPastContests } from "../controllers/codechef.controller";


const  ccRouter = express.Router();
// cfRouter.get('/details', getCfDetails);
// ccRouter.get('/upcoming-contests',);
ccRouter.get('/past-contests',getPastContests);
// ccRouter.get('/participated-contests/:uname',);

export default ccRouter;