import { Octokit } from "@octokit/core";

const createOrUpdateFile = async (pat, userName, repoName, path, content, message, sha = null) => {
    const octokit = new Octokit({ auth: pat });

    try {
        console.log("CREATING FILE with vals", pat, userName, repoName, path, sha);
        let fileData = {
            owner: userName,
            repo: repoName,
            path: path,
            content: content,
            message: message
        }
        if (sha) {
            fileData['sha'] = sha;
        }
        const response = await octokit.request(
            `PUT /repos/${userName}/${repoName}/contents/${path}`,
            fileData
        );
        return response.data.content.sha;
    } catch (error) {
        console.log("Creating file error from createFile function:", error);
        throw(error); // Indicate failed creation
    }
}



export default createOrUpdateFile;