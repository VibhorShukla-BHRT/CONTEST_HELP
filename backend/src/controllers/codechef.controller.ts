import { Request, Response } from "express";
import { fetchAllPastContests } from "../services/codechef.service";

const getPastContests = async(req: Request, res: Response)=>{
    const data = await fetchAllPastContests();
    res.send(data);
}
const getUpcomingContests = async(req: Request, res: Response)=>{

}
const getParticipatedContests = async(req: Request, res: Response)=>{

}
export {
    getPastContests
}