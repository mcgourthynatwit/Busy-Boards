import { Octokit } from "@octokit/core";
import { json } from "react-router-dom";


const getFileContent = async(pat, owner, repo, path) => {
    const octokit = new Octokit({ auth: pat });

    try {
        const response = await octokit.request(`GET /repos/${owner}/${repo}/contents/${path}`)
        const content = atob(response.data.content);
        const jsonData = JSON.parse(content);
        console.log("DATA", jsonData, "SHA", response.data.sha); // Log the parsed JSON data
        return [jsonData, response.data.sha];
        
    } catch (error) {
        console.error('Error fetching file:', error);
        throw error;
    }
}

export default getFileContent;
