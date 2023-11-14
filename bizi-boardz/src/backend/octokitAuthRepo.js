import { Octokit } from "@octokit/core";

const octokitAuthRepo = async (personalAccess, userName, repoUrl) => {
    const octokit = new Octokit({ auth: personalAccess });

    const parts = repoUrl.replace(/\/$/, '').split('/');
    const repoName = parts[parts.length - 1];

    try {
        const response = await octokit.request(`GET /repos/${userName}/${repoName}`);
        return response.status == 200
    } catch (error) {
        console.error('Error in octokitAuthRepo:', error);
        throw error;
    }
};


export { octokitAuthRepo };
