import { useState } from 'react';
import './Task.css'


const Task = ({id, taskData, update, deleteFunc}) => {

  function prog(val){
    taskData.progress += val;
    if(taskData.progress < 0){taskData.progress = 0}
    if(taskData.progress > taskData.steps){taskData.progress = taskData.steps}
    update(id, taskData);
  }

  return(
  <div className='root'>
    <div className='container'>
      <h3>{taskData.title}</h3>
      <p>
        <progress value={taskData.progress/taskData.steps} />
      </p>
      <p> {taskData.progress}/{taskData.steps} </p>
      <div>
        <button onClick={() => prog(-1)}> Sub </button>
        <button onClick={() => prog(1)}> Add </button>
      </div>
      <button onClick={() => deleteFunc(id, taskData.id)}>Delete</button>
    </div>
  </div>
  );
}

export default Task;
