import { Octokit } from "@octokit/core";
import { useEffect, useState } from "react";
import { useAuthUtils } from "../octokit/useAuthUtils";
import  getFileContent from "./getFileContent"
import createOrUpdateFile from "./createOrUpdateFile";

/**
 * Custom hook utility for task functions
 * 
 * @returns 
 */
const useTaskUtils = () => {
    const { pat, activeRepo, userName } = useAuthUtils();
    const parts = activeRepo.replace(/\/$/, '').split('/');
    const repoName = parts[parts.length - 1];
    const [tasks, setTasks] = useState([]);

    // Load task data on component mount
    useEffect(() => {
        getTasks();
    });

    let taskJSONFileSHA = null; // File blob sha is needed to update a file in github; this value should be updated after every file change

    // Pushes tasks state as JSON to github task.JSON
    const syncTasks = async (newTaskState, syncMessage = `System synced tasks from user ${userName}`) => {
        //TODO: maybe pull first?

        // Push serialized task state to github
        const path = "task.JSON";
        try {
            await createOrUpdateFile(pat, userName, repoName, path, btoa(JSON.stringify(newTaskState)), syncMessage, taskJSONFileSHA);
            setTasks(newTaskState);
            return true;
        } catch(error){
            console.log(error);
            return false;
        }
    }
   
    // Pushes new task into state, calls syncTasks to push changes to github
    const createTask = async ({taskName, assignee, description, priority, length, currentProgress}) => {
        const existingTasks = await getTasks(); // Must pull most recent changes first
        const newTaskData = {
            "name": taskName,
            "assignee": assignee,
            "description": description,
            "priority": priority,
            "length": length,
            "currentProgress": currentProgress
        }
        const newTaskState = [...existingTasks, newTaskData];
        return await syncTasks(newTaskState, `System pushed new task ${taskName} from user ${userName}`);
    }

    const updateTask = async () => {

    }

    /**
     * Should return data from task.JSON
     * If task.JSON not found, creates 
     * @returns 
     */
    const getTasks = async () => {
        const path = "task.JSON";
        
        try {
            // Try to get tasks from task.JSON and set task state
            const [taskData, fileSHA] = await getFileContent(pat, userName, repoName, path);
            taskJSONFileSHA = fileSHA;
            setTasks(taskData);
            console.log("Successfully set task state");

            return taskData;
        } catch (error) {
            if (error.response.status === 404){
                // Task.JSON was not found in project repo, create file and set sha; throws error if create fail
                console.log("CAUGHT ERROR TASK.JSON NOT FOUND");
                const sha = await createOrUpdateFile(pat, userName, repoName, path, btoa("[]"), "System created task.JSON");
                taskJSONFileSHA = sha;
            } else {
                // throw some type of error
            }
        }
    }

    return { createTask, tasks };
}

export default useTaskUtils;