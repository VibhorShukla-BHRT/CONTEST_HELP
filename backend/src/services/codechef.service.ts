import axios from "axios";
import * as cheerio from "cheerio";
import CodeChefAPIClient from "./scrapecc.service";
import dotenv from "dotenv";
dotenv.config();

const fetchAllPastContests = async (): Promise<any[]> => {
    const baseUrl = "https://www.codechef.com/api/list/contests/all";
    let offset = 0;
    let allContests: any[] = [];

    while (true) {
        try {
            const url = `${baseUrl}?sort_by=START&sorting_order=asc&offset=${offset}&mode=all`;
            const response = await axios.get(url);
            const data = response.data;

            if (data.past && data.past.length > 0) {
                allContests = allContests.concat(data.past);
                offset += data.past.length; // Move to next page
            } else {
                break; // Stop when no more past contests are returned
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            break;
        }
    }

    return allContests;
};

export { fetchAllPastContests };
