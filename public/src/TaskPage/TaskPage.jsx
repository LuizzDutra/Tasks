import { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task/Task';
import AddPanel from './AddPanel/AddPanel';

import './TaskPage.css';

let loaded_tasks = false;
 
const TaskPage = () => {
  const [taskState, setTaskState] = useState([]);
  const [activePanel, setActivePanel] = useState(false);


  const logged_in = false;
  const apiUrl = import.meta.env.VITE_API_URL
 
  async function getTasksApi(){
      if(logged_in){
      axios.get(`${apiUrl}/tasks`)
      .then((response) => {setTaskState(response.data)});
      }else{
        const tasks_ls = JSON.parse(localStorage.getItem("tasks"));
        if(tasks_ls){setTaskState(tasks_ls);}
      }
    loaded_tasks = true;
  }
  
  async function updateTaskProgessApi(data){
    await axios.patch(`${apiUrl}/tasks?id=${data.id}&field=progress&val=${data.progress}`);
  }

  async function deleteTaskApi(id){
    await axios.delete(`${apiUrl}/tasks?id=${id}`);
  }

  async function addTaskApi(title, steps){
    let answer;
    let status;
    await axios.post(`${apiUrl}/tasks?title=${title}&steps=${steps}`)
      .then((response) => {
        status = true;
        answer = response;
      })
      .catch((error) => {
        status = false;
        answer = error;
      }
      );
    
    return [status, answer];
  }


  async function addTask(title, steps){
    let status;
    let response;
    if(logged_in){
      [status, response] = await addTaskApi(title, steps);
      response = response.data;
    }else{
      status = true;
      response = {title: title, steps: steps, id:0, progress:0}
    }
    if(status){
      let temp = [...taskState];
      temp.push(response);
      setTaskState(temp);
    }
    return [status, response];
  }

  async function updateTasks(id, data){
    if(logged_in){
      await updateTaskProgessApi(data);
    }
    let temp = [...taskState];
    temp[id] = data;
    setTaskState(temp);
  }

  async function deleteTasks(id, data_id){
    if(logged_in){
    await deleteTaskApi(data_id);
    }
    let temp = [...taskState];
    temp.splice(id, 1);
    setTaskState(temp);
  }
  
  useEffect(() => {
    getTasksApi();
  }, []);

  function renderTasks(){
    if(!logged_in && loaded_tasks){
    localStorage.setItem("tasks", JSON.stringify([...taskState]));
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
    <p> { localStorage.getItem("Tasks") }</p>
    <div class="pb-5 pt-5">
      <button
      class="bg-blue-400 shadow-gray-600/50 shadow-lg p-2 rounded-lg transition duration 300 ease-out hover:scale-120"
      onClick={() => setActivePanel(!activePanel)}>Add Task</button>
    </div>
    <div class="mt-10 grid grid-cols-2 gap-10 w-fit">
      {renderTasks()}
    </div>
  </div>
  );
}

export default TaskPage;

