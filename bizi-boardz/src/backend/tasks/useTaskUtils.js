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
    const [taskJSONError, setTaskJSONError] = useState(false);
    const [ taskJSONFileSHA, setTaskJSONSHA ] = useState('');

    // File blob sha is needed to update a file in github; this value should be updated after every file change
    let task_json_file_sha = null;

    useEffect(() => {
        console.log("useffect GOT VALUES FROM AUTH HOOK", pat, activeRepo, userName);
        getTasks();
    }, [pat, activeRepo, userName]);

    // Pushes tasks state as JSON to github task.JSON
    const syncTasks = async (syncMessage = `System synced tasks from user ${userName}`) => {
        //TODO: maybe pull first?

        // Push serialized task state to github
        const path = "task.JSON";
        try {
            console.log("SYNC TASKS CALLING UPDATE FILE WITH SHA", task_json_file_sha);
            const sha = await createOrUpdateFile(pat, userName, repoName, path, btoa(JSON.stringify(tasks)), syncMessage, taskJSONFileSHA);
            setTaskJSONSHA(sha);
            return true;
        } catch(error){
            console.log(error);
            return false;
        }
    }
   
    // Pushes new task into state, calls syncTasks to push changes to github
    const createTask = async ({taskName, assignee, description, priority, length, currentProgress}) => {
        tasks.push({
            "name": taskName,
            "assignee": assignee,
            "description": description,
            "priority": priority,
            "length": length,
            "currentProgress": currentProgress
        });
        return await syncTasks(`System pushed new task ${taskName} from user ${userName}`);
    }

    const updateTask = async () => {

    }

    const getTasks = async () => {
        const path = "task.JSON";
        
        try {
            // Try to get tasks from task.JSON and set task state
            const [taskData, fileSHA] = await getFileContent(pat, userName, repoName, path);
            setTaskJSONSHA(fileSHA);
            console.log("GET TASKS HAS SET THE SHA TO", fileSHA);
            setTasks(taskData);
            console.log("Successfully set task state");
        } catch (error) {
            if (error.response.status === 404){
                // Task.JSON was not found in project repo, create file and set sha; throws error if create fail
                console.log("CAUGHT ERROR TASK.JSON NOT FOUND");
                const sha = await createOrUpdateFile(pat, userName, repoName, path, btoa("[]"), "System created task.JSON");
                setTaskJSONSHA(sha);
            } else {
                setTaskJSONError(true);
            }
        }
    }

    return { createTask, tasks };
}

export default useTaskUtils;