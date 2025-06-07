import axios, { AxiosInstance } from 'axios';
class CodeChefAPIClient {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private baseURL: string = 'https://api.codechef.com';

  constructor(clientId: string, clientSecret: string) {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Set up authentication
    this.authenticate(clientId, clientSecret);
  }

  /**
   * Authenticate with the CodeChef API
   */
  private async authenticate(clientId: string, clientSecret: string): Promise<void> {
    try {
      const response = await axios.post(`${this.baseURL}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'public',
      });

      this.authToken = response.data.access_token;
      
      // Set the auth token for all future requests
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
      
      console.log('Authentication successful');
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  /**
   * Get all past contests
   */
  async getPastContests(limit: number = 10, offset: number = 0): Promise<any> {
    try {
      const response = await this.client.get('/contests', {
        params: {
          status: 'past',
          limit,
          offset,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching past contests:', error);
      throw error;
    }
  }

  /**
   * Get details of a specific contest
   */
  async getContestDetails(contestCode: string): Promise<any> {
    try {
      const response = await this.client.get(`/contests/${contestCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for contest ${contestCode}:`, error);
      throw error;
    }
  }

  /**
   * Get problems in a specific contest
   */
  async getContestProblems(contestCode: string): Promise<any> {
    try {
      const response = await this.client.get(`/contests/${contestCode}/problems`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching problems for contest ${contestCode}:`, error);
      throw error;
    }
  }

  /**
   * Get ranklist for a specific contest
   */
  async getContestRanklist(contestCode: string, limit: number = 50, offset: number = 0): Promise<any> {
    try {
      const response = await this.client.get(`/contests/${contestCode}/ranklist`, {
        params: {
          limit,
          offset,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ranklist for contest ${contestCode}:`, error);
      throw error;
    }
  }
}

export default CodeChefAPIClient;