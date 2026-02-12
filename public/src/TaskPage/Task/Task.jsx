import { useState } from 'react';
import './Task.css'


const Task = ({id, taskData, update, deleteFunc}) => {

  function prog(val){
    taskData.progress += val;
    if(taskData.progress < 0){taskData.progress = 0}
    if(taskData.progress > taskData.steps){taskData.progress = taskData.steps}
    update(id, taskData);
  }

  const buttonStyle = "bg-blue-200  pl-6 pr-6 m-1 rounded-full text-2xl transition duration-300 ease-out hover:scale-110";


  return(
  <div >
    <div class='bg-gray-200 p-3 rounded-xl grid justify-items-center'>
      <h1 class="text-xl font-bold">{taskData.title}</h1>
        <progress class="bg-gray-400" 
        value={taskData.progress/taskData.steps} />
      <p class="italic"> {taskData.progress}/{taskData.steps} </p>
      <div>
        <button
        class={ buttonStyle }
        onClick={() => prog(-1)}> Sub </button>
        <button 
        class={ buttonStyle }
        onClick={() => prog(1)}> Add </button>
      </div>
      <button class={buttonStyle} style={{backgroundColor: "#FFAAAA"}} onClick={() => deleteFunc(id, taskData.id)}>Delete</button>
    </div>
  </div>
  );
}

export default Task;
