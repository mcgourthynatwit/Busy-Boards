import { Octokit } from "@octokit/core";

const createFile = async (pat, userName, repoName, path, content, message) => {
    const octokit = new Octokit({ auth: pat });

    try {
        const response = await octokit.request(
            "POST /repos/{userName}/{repoName}/contents/{path}",
            {
            owner: userName,
            repo: repoName,
            path: path,
            content: content,
            message: message,
            }
        );
        return response.status === 200;
    } catch (error) {
        return false; // Indicate failed creation
    }
}

export default createFile;