import { Octokit } from "@octokit/core";

const octokitAuthRepo = async (personalAccess, repoUrl) => {
    const octokit = new Octokit({ auth: personalAccess });

    const parts = repoUrl.replace(/\/$/, '').split('/');
    const userName = parts[parts.length - 2];
    const repoName = parts[parts.length - 1];

    try {
        const response = await octokit.request(`GET /repos/${userName}/${repoName}`);
        console.log(response.data)
        console.log(response)
        return response.status === 200
    } catch (error) {
        console.error('Error in octokitAuthRepo:', error);
        throw error;
    }
};


export { octokitAuthRepo };
