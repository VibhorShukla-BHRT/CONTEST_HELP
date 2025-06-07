import axios from "axios";
import { contestModel } from "../models/models";

const fetchUpcomingContests = async () => {
  try {
    const allContests = await contestModel.find(); // Get all contests

    const upcoming = allContests.filter(
      //@ts-ignore
      (contest) => !contest.expired && contest.platform === "codeforces"
    );
    return upcoming;
  } catch (err) {
    console.log(err);
  }
};
async function retrurnParticipatedContests(username: string) {
  try {
    const url = `https://codeforces.com/api/user.rating?handle=${username}`;
    const resp = await axios.get(url);
    if (resp.data.status !== "OK") {
      throw new Error("Failed to fetch contests");
    }

    const contests = resp.data.result;

    const contestLinks = contests.map(
      (contest: any) => `https://codeforces.com/contests/${contest.contestId}/`
    );
    console.log(contestLinks);
    // Query MongoDB for matching contests
    const participatedContests = await contestModel.find({
      link: { $in: contestLinks },
    });
    console.log(participatedContests);
    return participatedContests;
  } catch (err) {
    console.error(err);
  }
}
const populateCfContests = async () => {
  try {
    const url = `https://codeforces.com/api/contest.list`;
    const resp = await axios.get(url);
    await populate(resp.data.result);
  } catch (err) {
    console.error(err);
  }
};
async function populate(result: any[]) {
  try {
    const contestsToInsert = result.map((contest) => ({
      title: contest.name,
      start_date: new Date(contest.startTimeSeconds * 1000), // todo: convert utc to ist
      platform: "codeforces",
      duration: contest.durationSeconds,
      link: `https://codeforces.com/contests/${contest.id}/`,
    }));
    await contestModel.insertMany(contestsToInsert, { ordered: false });
    console.log("Contests Saved!");
  } catch (error: any) {
    if (error.code === 11000) {
      console.log("Some contests already exist, skipping duplicates.");
    } else {
      console.error("Error saving contests:", error);
    }
  }
}
export {
  fetchUpcomingContests,
  populateCfContests,
  retrurnParticipatedContests,
};
