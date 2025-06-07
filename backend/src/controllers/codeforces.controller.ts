import { Request, Response } from "express";
import { fetchUpcomingContests, populateCfContests, retrurnParticipatedContests } from "../services/codeforces.service";
import { contestModel } from "../models/models";

const getPastContests = async(req: Request, res: Response)=>{
    const contests = await contestModel.find({platform: "codeforces"});
    res.send(contests);
}
const takenContests = async(req: Request, res: Response)=>{
    const {uname} = req.params;
    const contests = await retrurnParticipatedContests(uname);
    res.send(contests);
}
const getCfDetails = async(req: Request, res: Response)=>{
    //get user details
}
const getUpcomingContests = async(req: Request, res: Response)=>{
    const resp = await fetchUpcomingContests();
    res.send(resp);
}
/*
todo:
populate mongo with cf contests
get upcoming contests
*/
export{
    getCfDetails,
    takenContests,
    getPastContests,
    getUpcomingContests
}