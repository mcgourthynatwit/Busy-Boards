import { Octokit } from "@octokit/core";

const octokitAuth = async (url, personalAccess) => {
    const octokit = new Octokit({ auth: personalAccess });

    
    try {
        const response = await octokit.request('GET /user');
        return response.data.login; // This will return the username of the authenticated user
    } catch (error) {
        console.error('Error in octokitAuth:', error);
        throw error;
    }
};


export { octokitAuth };
