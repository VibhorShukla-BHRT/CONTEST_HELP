import { Request, Response } from "express";
import { fetchLeetCodeProfile, getUpcomingContests } from "../services/leetcode.service";
import { contestModel } from "../models/models";

const getDetails = async(req: Request, res: Response)=>{
    const resp = await fetchLeetCodeProfile("Monarch69");
    console.log(resp)
    res.send("ok");
}
const upcomingContest = async (req: Request, res: Response) => {
    await getUpcomingContests();
    const allContests = await contestModel.find(); // Get all contests
    //@ts-ignore
    const upcoming = allContests.filter(contest => (!contest.expired && contest.platform==='leetcode')); // Filter in JS
    res.send(upcoming);
};
export {
    getDetails,
    upcomingContest
}