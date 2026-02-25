import { useState } from 'react';
import './Task.css'


const Task = ({id, taskData, update, deleteFunc}) => {

  function prog(val){
    taskData.progress = parseInt(taskData.progress) + val;
    if(taskData.progress < 0){taskData.progress = 0}
    if(taskData.progress > taskData.steps){taskData.progress = taskData.steps}
    update(id, taskData);
  }

  const buttonStyle = "bg-cool-sky-200  pl-6 pr-6 m-1 rounded-full text-2xl transition duration-300 ease-out hover:scale-110";


  return(
  <div class="w-1/1">
    <div class='bg-ivory-mist-100 border-10 border-mauve-bark-300 border-double p-3 rounded-xl flex flex-col gap-1 justify-items-center w-45 md:w-60 break-all'>
      <h1 class="text-xl font-bold">{taskData.title}</h1>
        <progress class="bg-gray-400 w-1/1" 
        value={taskData.progress/taskData.steps} />
      <p class="italic"> {taskData.progress}/{taskData.steps} </p>
      <div class="flex flex-col mb-5">
        <button
        class={ buttonStyle }
        onClick={() => prog(-1)}> Sub </button>
        <button 
        class={ buttonStyle }
        onClick={() => prog(1)}> Add </button>
      </div>
      <button class={'bg-powder-blush-200 ' + buttonStyle} onClick={() => deleteFunc(id, taskData.id)}>Delete</button>
    </div>
  </div>
  );
}

export default Task;
