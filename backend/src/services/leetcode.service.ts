import axios from "axios";
import { contestModel, leetcodeModel } from "../models/models";
const url = "https://leetcode.com/graphql";
const fetchLeetCodeProfile = async (username: string) => {
  const query = {
    query:
      "\n query userContestRankingInfo($username: String!) {\n userContestRanking(username: $username) {\n attendedContestsCount\n rating\n globalRanking\n totalParticipants\n topPercentage\n badge {\n name\n }\n }\n userContestRankingHistory(username: $username) {\n attended\n problemsSolved\n totalProblems\n finishTimeInSeconds\n rating\n ranking\n contest {\n title\n startTime\n }\n }\n}\n ",
    variables: { username },
  };

  try {
    const response = await axios.post(url, query, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.errors) {
      console.error("GraphQL Error:", response.data.errors);
      return null;
    }
    if (response) {
      const userLCprofile = await leetcodeModel.findOne({ uname: username });
      if (!userLCprofile) {
        const contests_attended =
          response.data.data.userContestRankingHistory.filter((ele: any) => {
            return ele.attended;
          });
        const newAcc = new leetcodeModel({
          uname: username,
          rating: response.data.data.userContestRanking.rating,
          contests_attended,
        });
        await newAcc.save();
      }
      // userLCprofile.rating = response.data.data.userContestRanking.rating;
    }
    // console.log(response.data.data.userContestRankingHistory.filter((ele:any)=>{return ele.attended}));
    return response.data.data.userContestRanking;
  } catch (error) {
    console.error("Error fetching LeetCode profile:", error);
    return null;
  }
};

const getUpcomingContests = async () => {
  const query = {
    query:
      "\n query topTwoContests {\n topTwoContests {\n title\n startTime\n duration\n }\n}\n ",
    variables: {},
  };
  try {
    const response = await axios.post(url, query, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.errors) {
      console.error("GraphQL Error:", response.data.errors);
      return null;
    }
    await saveLeetCodeContests(response.data.data.topTwoContests);
    // console.log(response.data.data.topTwoContests);
  } catch (err) {
    console.log(err);
  }
};
async function saveLeetCodeContests(topTwoContests: any[]) {
  try {
    let contestsToInsert;
    if (topTwoContests.length <= 2) {
      contestsToInsert = topTwoContests.map((contest) => ({
        title: contest.title,
        start_date: new Date(contest.startTime * 1000), // todo: convert utc to ist
        platform: "leetcode",
        duration: contest.duration,
        link: `https://leetcode.com/contest/${contest.title
          .toLowerCase()
          .replace(/\s+/g, "-")}/`,
      }));
    } else {
      contestsToInsert = topTwoContests.map((ele) => ({
        title: ele.contest.title,
        start_date: new Date(ele.contest.startTime * 1000), // todo: convert utc to ist
        platform: "leetcode",
        duration: ele.contest.duration,
        link: `https://leetcode.com/contest/${ele.contest.title
          .toLowerCase()
          .replace(/\s+/g, "-")}/`,
      }));
    }

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
const populateContestsLC = async (username: string) => {
  const query = {
    query:
      "\n query userContestRankingInfo($username: String!) {\n userContestRankingHistory(username: $username) {\n contest {\n title\n startTime\n duration\n }\n }\n}\n ",
    variables: { username },
  };

  try {
    const response = await axios.post(url, query, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.errors) {
      console.error("GraphQL Error:", response.data.errors);
      return null;
    }
    if (response) {
      await saveLeetCodeContests(response.data.data.userContestRankingHistory);
      // console.log(response.data.data.userContestRankingHistory);
    }
    // console.log(response.data.data.userContestRankingHistory.filter((ele:any)=>{return ele.attended}));
    return response.data.data.userContestRanking;
  } catch (error) {
    console.error("Error fetching LeetCode profile:", error);
    return null;
  }
};
// fetchLeetCodeProfile("Monarch69").then(data => console.log(data));
export { fetchLeetCodeProfile, getUpcomingContests, populateContestsLC };
