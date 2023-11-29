import { Octokit } from "@octokit/core";
import { useEffect, useState, useCallback } from "react";
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
    const [tasks, setTasks] = useState([]); //Todo, move to context?

    /**
     * ! Only to be used to manage internal state, components should use "task" state value
     * Returns data from task.JSON if file exists; sets task state to response
     * If file does not exist, creates task.JSON and returns empty array []
     * @returns [taskData[], sha] of task.JSON
     */
    const getTasks = useCallback(async () => {
        const path = "task.JSON";
        
        try {
            // Try to get tasks from task.JSON
            const [taskData, fileSHA] = await getFileContent(pat, userName, repoName, path);

            // Set task state
            setTasks(taskData); 
            
            console.log("Successfully set task state");
            return [taskData, fileSHA];
        } catch (error) {
            if (error.response.status === 404){
                // Task.JSON was not found in project repo, create file
                const initialContent = [];
                const fileSHA = await createOrUpdateFile(pat, userName, repoName, path, btoa(JSON.stringify(initialContent)), "System created task.JSON");

                console.warn("task.JSON not found in project repo, created file!");
                return [initialContent, fileSHA];
            } else {
                // throw some type of error
            }
        }
    }, [pat, userName, repoName]);

    // Load task data on component mount, (set state so ViewBacklog page can render)
    useEffect(() => {
        console.log("Use effect calling get tasks");
        getTasks();

    }, [getTasks]);


    /**
     * Attempts to push newTaskState to GitHub, sets task state if successful
     * @param {*} newTaskState must be formed from a previous call to getTasks()! If task_JSON_sha is not most recent value
     *                          in GitHub, sync will fail to prevent data overwrite and return false
     * @param {*} syncMessage commit message 
     * @returns true if sync successful, false if otherwise (task.JSON maybe modified in time between get and sync)
     */
    const syncTasks = async (newTaskState, task_JSON_sha, syncMessage = `System synced tasks from user ${userName}`) => {
        const path = "task.JSON";
        // Push newTaskState to github
        try {
            await createOrUpdateFile(pat, userName, repoName, path, btoa(JSON.stringify(newTaskState)), syncMessage, task_JSON_sha);

            // Successful sync, set task state
            setTasks(newTaskState);
            return true;
        } catch(error){
            console.log(error);

            // Sync failed, file sha may have changed
            return false;
        }
    }
   
   /**
    * Creates a new task by retrieving up-to-date file from github, 
    * appending new task, and calling syncTask with new state
    * 
    * @returns true if task creation successful, false if otherwise
    */
    const createTask = async ({taskName, assignee, description, priority, length, currentProgress}) => {
        const [existingTasks, fileSHA] = await getTasks(); // Must pull most recent changes first
        const newTaskData = {
            "name": taskName,
            "assignee": assignee,
            "description": description,
            "priority": priority,
            "length": length,
            "currentProgress": currentProgress
        }
        const newTaskState = [...existingTasks, newTaskData];
        return await syncTasks(newTaskState, fileSHA, `System pushed new task ${taskName} from user ${userName}`);
    }

    const updateTask = async () => {

    }

    return { createTask, tasks };
}

export default useTaskUtils;