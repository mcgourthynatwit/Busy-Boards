import { Octokit } from "@octokit/core";
import { useState } from "react";
import { useAuthContext } from "../../pages/AuthProvider";

/**
 * Custom hook utility for authentication functions AND
 * Holds state of auth-related info (personal access toke, active repo url, logged in username)
 * 
 * @returns object '{ pat, setPAT, activeRepo, setActiveRepo, userName, setUserName, octokitAuth, octokitAuthRepo }'
 * pat:                 personal access token
 * setPAT:              set personal access token
 * activeRepo:          url of repo
 * setActiveRepo:       set active repo url
 * userName:            user name
 * setUserName:         set user name
 * octokitAuth:         returns name of authenticated user (using pat)
 * octokitAuthRepo:     returns true if valid activeRepo url 
 */
const useAuthUtils = () => {
    const {pat, setPAT, activeRepo, setActiveRepo, userName, setUserName} = useAuthContext(); // calls useContext hook in AuthProvider, returns value of AuthProvider 
    const octokit = new Octokit({ auth: pat });

    const octokitAuth = async () => {
        try {
            const response = await octokit.request('GET /user');
            return response.data.login; // This will return the username of the authenticated user
        } catch (error) {
            console.error('Error in octokitAuth:', error);
            throw error;
        }
    };

    const octokitAuthRepo = async () => {
        const parts = activeRepo.replace(/\/$/, '').split('/');
        const repoName = parts[parts.length - 1];
        const userName = parts[parts.length - 2]; // Extract username from url because username in state may not be set yet

        try {
            const response = await octokit.request(`GET /repos/${userName}/${repoName}`);
            return response.status === 200
        } catch (error) {
            return false;
        }
    };

    return { pat, setPAT, activeRepo, setActiveRepo, userName, setUserName, octokitAuth, octokitAuthRepo };
}

export { useAuthUtils };