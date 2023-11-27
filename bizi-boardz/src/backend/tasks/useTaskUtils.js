import { Octokit } from "@octokit/core";
import { useEffect, useState } from "react";
import { useAuthUtils } from "../octokit/useAuthUtils";
import  getFileContent from "./getFileContent"
import createFile from "./createFile";

/**
 * Custom hook utility for task functions
 * 
 * @returns 
 */
const useTaskUtils = () => {
    const { pat, activeRepo, userName } = useAuthUtils();
    const parts = activeRepo.replace(/\/$/, '').split('/');
    const repoName = parts[parts.length - 1];
    const [tasks, setTasks] = useState('');
    const [taskJSONError, setTaskJSONError] = useState(false);

    useEffect(() => {
        getTasks();
    }, [pat, activeRepo, userName]);
   
    const createTask = async () => {

    }

    const updateTask = async () => {

    }

    const getTasks = async () => {
        const path = "task.JSON";
        try {
            // Try to get tasks from task.JSON and set task state
            const taskData = await getFileContent(pat, userName, repoName, path);
            setTasks(taskData);
        } catch (error) {
            if (error.response.status == 404){
                // Task.JSON was not found in project repo, create file
        
                console.log("CAUGHT ERROR TASK.JSON NOT FOUND, CREATING FILE");
                const createSuccess = await createFile(pat, userName, repoName, path, "[]", "");
                if (!createSuccess) {
                    setTaskJSONError(true);
                }
            } else {
                setTaskJSONError(true);
            }
        }
    }

    return { createTask, tasks };
}

export { useTaskUtils };