import { useState, useEffect } from 'react';
import { getTasksController, addTaskController, updateTaskController, deleteTaskController, setLocalStorage} from "./controller";
import Task from './Task/Task';
import AddPanel from './AddPanel/AddPanel';

import './TaskPage.css';

let logged_in = true;
 
const TaskPage = () => {
  const [taskState, setTaskState] = useState([]);
  const [activePanel, setActivePanel] = useState(false);
  const [loadedTasks, setLoadedTasks] = useState(false);


  async function getTasks(){
    let [status, data] = await getTasksController();
    if(status){
      setTaskState(data);
      setLoadedTasks(true);
    }
  }



  async function addTask(title, steps){
    let [status, data] = await addTaskController(title, steps);
    if(status){
      let temp = [...taskState];
      temp.push(data);
      setTaskState(temp);
    }
    return [status, data];
  }

  async function updateTasks(id, data){
    await updateTaskController(data);
    let temp = [...taskState];
    temp[id] = data;
    setTaskState(temp);
  }

  async function deleteTasks(id, data_id){
    deleteTaskController(data_id);
    let temp = [...taskState];
    temp.splice(id, 1);
    setTaskState(temp);
  }
  
  if(!loadedTasks){
    getTasks();
  }

  function renderTasks(){
    if(loadedTasks){
    setLocalStorage([...taskState]);     
    }
    return taskState.map((d, idx) => 
      <Task key={idx} 
      id={idx} taskData={d} 
      update={updateTasks}
      deleteFunc={deleteTasks}
      />);
  }

  return(
  <div class="p-8">
    {activePanel && 
     <AddPanel 
      addFunction={addTask}
      setActivePanel={setActivePanel}/>}
    <h1 class="text-4xl font-bold ">Task Page</h1>
    <div class="pb-5 pt-5">
      <button
      class="bg-blue-400 shadow-gray-600/50 shadow-lg p-2 rounded-lg transition duration 300 ease-out hover:scale-120"
      onClick={() => setActivePanel(!activePanel)}>Add Task</button>
    </div>
    <div class="mt-10 grid grid-cols-2 gap-10 w-fit">
      {loadedTasks && renderTasks()}
    </div>
  </div>
  );
}

export default TaskPage;

