import { Octokit } from "@octokit/core";


const getFileContent = async(owner, repo, path) => {
    const octokit = new Octokit({ auth: 'ACCESS CODE GO HERE' });

    try {
        const response = await octokit.request(`GET /repos/${owner}/${repo}/contents/${path}`)

        const content = atob(response.data.content);
        const jsonData = JSON.parse(content);
        console.log("DATA", jsonData); // Log the parsed JSON data
    } catch (error) {
        console.error('Error fetching file:', error);
        throw error;
    }
}

export {getFileContent}
