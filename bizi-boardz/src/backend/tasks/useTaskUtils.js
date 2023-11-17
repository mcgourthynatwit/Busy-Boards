import { Octokit } from "@octokit/core";
import { useState } from "react";
import { useAuthUtils } from "../octokit/useAuthUtils";

/**
 * Custom hook utility for task functions
 * 
 * @returns 
 */
const useTaskUtils = () => {
    const { pat } = useAuthUtils();
    const createTask = async () => {

    }
}

export { useTaskUtils };