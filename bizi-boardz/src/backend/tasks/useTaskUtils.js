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
    const [taskCreateError, setTaskCreateError] = useState(false);

    // File blob sha is needed to update a file in github; this value should be updated after every file change
    let task_json_file_sha = null;

    useEffect(() => {
        console.log("useffect GOT VALUES FROM AUTH HOOK", pat, activeRepo, userName);
        getTasks();
    }, [pat, activeRepo, userName]);

    // Pushes tasks state as JSON to github task.JSON
    const syncTasks = async () => {
        //TODO: maybe pull first?
        
        // Push serialized task state to github
        const path = "task.JSON";
        try {
            task_json_file_sha = await createOrUpdateFile(pat, userName, repoName, path, btoa(JSON.stringify(tasks)), "System created task.JSON", task_json_file_sha);
            return true;
        } catch(error){
            setTaskCreateError(true);
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
        return await syncTasks();
    }

    const updateTask = async () => {

    }

    const getTasks = async () => {
        const path = "task.JSON";
        
        try {
            // Try to get tasks from task.JSON and set task state
            const taskData = await getFileContent(pat, userName, repoName, path);
            setTasks(taskData);
            console.log("Successfully set task state");
        } catch (error) {
            if (error.response.status === 404){
                // Task.JSON was not found in project repo, create file and set sha; throws error if create fail
                console.log("CAUGHT ERROR TASK.JSON NOT FOUND");
                task_json_file_sha = await createOrUpdateFile(pat, userName, repoName, path, btoa("[]"), "System created task.JSON");
               
                console.log("RESULT OF CREATE FILE:", createSuccess)
            } else {
                setTaskJSONError(true);
            }
        }
    }

    return { createTask, tasks };
}

export default useTaskUtils;