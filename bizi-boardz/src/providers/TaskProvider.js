import { createContext, useContext } from "react";
import { useState } from "react";

const TaskContext = createContext();

const TaskProvider = (props) => {
    const [tasks, setTasks] = useState([]);

    return <TaskContext.Provider value={[tasks, setTasks]}>
        {props.children}
    </TaskContext.Provider>
}

const useTaskContext = () => {
    return useContext(TaskContext);
}

export { useTaskContext };
export default TaskProvider;