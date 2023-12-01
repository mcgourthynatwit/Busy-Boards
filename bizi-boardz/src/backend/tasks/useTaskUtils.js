import { Octokit } from "@octokit/core";
import { useEffect, useState } from "react";
import { useAuthUtils } from "../octokit/useAuthUtils";
import getFileContent from "./getFileContent"
import createOrUpdateFile from "./createOrUpdateFile";
import { v4 as uuidv4 } from 'uuid'

/**
 * Custom hook utility for task functions
 * 
 * @returns 
 */
const useTaskUtils = () => {
    const { pat, activeRepo, userName } = useAuthUtils();
    const parts = activeRepo.replace(/\/$/, '').split('/');
    const repoName = parts[parts.length - 1];
    const [tasks, setTasks] = useState();

    /**
     * Creates file task.JSON in repository
     * If request returns error 422, task.JSON already exists
     * @param {*} path should be = "task.JSON"
     * @returns [taskData[], sha]
     */
    const createTaskJSONFile = async (path) => {
        const initialContent = [];
        try {
            console.log("create task.json trying to create task.json");
            const fileSHA = await createOrUpdateFile(pat, userName, repoName, path, btoa(JSON.stringify(initialContent)), "System created task.JSON");
            console.warn("task.JSON not found in the project repo, created file!");
            return [initialContent, fileSHA];
        } catch (error) {
            // Sha was not supplied: task.JSON was created by someone else before we resolved.
            if (error.response && error.response.status === 422) {
                console.warn("task.JSON did not exist in the initial call, but now does! Returning data...");
                return await getFileContent(pat, userName, repoName, path);
            } else {
                // Throw error if status != 422 (in any case besides task.JSON created before resolving)
                throw error;
            }
        }
    };

    /**
     * ! Only to be used to manage internal state, components should use "tasks" state value
     * Returns data from task.JSON and sha of task.JSON; sets task state to response if file exists
     * If file does not exist, creates task.JSON and returns [[], sha]
     * @returns [taskData[], sha] of task.JSON
     */
    const getTasks = async () => {
        const path = "task.JSON";

        try {
            // Try to get tasks from task.JSON
            const [taskData, fileSHA] = await getFileContent(pat, userName, repoName, path);
            // Set task state
            setTasks(taskData);

            console.log("Successfully set task state");
            return [taskData, fileSHA];
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Task.JSON was not found in the project repo, create file
                console.log("Get tasks calling create task.json");
                return await createTaskJSONFile(path);
            } else {
                // Throw error if status != 404 (in any case besides task.JSON not found)
                throw error;
            }
        }
    }

    // Load task data on component mount, (set state so ViewBacklog page can render)
    useEffect(() => {
        console.log("Use effect calling get tasks");
        getTasks()
            .catch((error) => {
                 console.log("Useeffect failed to get tasks")
            });

    }, [pat, activeRepo, userName]);


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
            console.log("Sync tasks calling create...");
            await createOrUpdateFile(pat, userName, repoName, path, btoa(JSON.stringify(newTaskState, null, 2)), syncMessage, task_JSON_sha);

            // Successful sync, set task state
            setTasks(newTaskState);
            return true;
        } catch (error) {
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
    const createTask = async ({ taskName, assignee, description, priority, length, currentProgress }) => {
        const [existingTasks, fileSHA] = await getTasks() // Must pull most recent changes first
            .catch((error) => {
                console.log("Create task failed to get current tasks!", error);
                return false
            });

        const UUID = uuidv4()
        const newTaskData = {
            "taskID": UUID,
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

    const updateTask = async ({taskID, taskName, assignee, description, priority, length, currentProgress}) => {
        // get current tasks array
        const [existingTasks, fileSHA] = await getTasks()
            .catch((error) => {
                console.log("Update task failed to get current tasks!", error);
                return false
            });

        // filter out old task create new array 
        const updatedTasks = existingTasks.filter(task => task.taskID !== taskID);
        
        const newTaskData = {
            "taskID": taskID, 
            "name": taskName,
            "assignee": assignee,
            "description": description,
            "priority": priority,
            "length": length,
            "currentProgress": currentProgress
        } 
        
        const newTaskState = [...updatedTasks, newTaskData];
        console.log("Update task calling sync task with sha", fileSHA);
        return await syncTasks(newTaskState, fileSHA, `System pushed updated task ${taskName} from user ${userName}`);
    }

    const delTask = async (taskUUID) => {
        console.log('deleting task ', taskUUID)
        const [existingTasks, fileSHA] = await getTasks()
            .catch((error) => {
                console.log("Delete task failed to get current tasks!", error);
                return false
            });

        // getTasks gets all tasks so filter out task with the uuid
        const updatedTasks = existingTasks.filter(task => task.taskID !== taskUUID);

        // check if length is the same
        if (updatedTasks.length === existingTasks.length) {
            console.log('Task not found')
            return false;
        }
        return await syncTasks(updatedTasks, fileSHA, `System removed task with UUID ${taskUUID} by user ${userName}`);
    }
    return { createTask, delTask, updateTask, tasks };
}

export default useTaskUtils;