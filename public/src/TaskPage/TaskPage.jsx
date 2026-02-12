import { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task/Task';
import AddPanel from './AddPanel/AddPanel';

import './TaskPage.css';


 
const TaskPage = () => {
  const [taskState, setTaskState] = useState([]);
  const [activePanel, setActivePanel] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL
 
  async function getTasks(){
      axios.get(`${apiUrl}/tasks`)
      .then((response) => {setTaskState(response.data)});
  }
  
  async function updateTaskProgess(data){
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
    let [status, response] = await addTaskApi(title, steps);
    if(status){
      let temp = [...taskState];
      temp.push(response.data);
      setTaskState(temp);
    }
    return [status, response];
  }

  async function updateTasks(id, data){
    await updateTaskProgess(data);
    let temp = [...taskState];
    temp[id] = data;
    setTaskState(temp);
  }

  async function deleteTasks(id, data_id){
    await deleteTaskApi(data_id);
    let temp = [...taskState];
    temp.splice(id, 1);
    setTaskState(temp);
  }
  
  useEffect(() => {
    getTasks();
  }, []);

  function renderTasks(){
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
      {renderTasks()}
    </div>
  </div>
  );
}

export default TaskPage;

