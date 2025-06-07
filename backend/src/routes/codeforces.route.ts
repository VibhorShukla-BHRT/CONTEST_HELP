import express from "express"
import { getCfDetails, getPastContests, getUpcomingContests, takenContests } from "../controllers/codeforces.controller";


const  cfRouter = express.Router();

// cfRouter.get('/details', getCfDetails);
cfRouter.get('/upcoming-contests', getUpcomingContests);
cfRouter.get('/past-contests', getPastContests);
cfRouter.get('/participated-contests/:uname', takenContests);

export default cfRouter;