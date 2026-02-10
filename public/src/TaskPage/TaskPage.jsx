import { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task/Task';

import './TaskPage.css';

 
const TaskPage = () => {
  const [taskState, setTaskState] = useState([]);

  async function getTasks(){
      axios.get('http://localhost:8000/api/tasks')
      .then((response) => {setTaskState(response.data)});
  }
  
  async function updateTaskProgess(data){
    await axios.patch('http://localhost:8000/api/tasks?id='+data.id+'&field=progress&val='+data.progress)
  }

  async function updateTasks(id, data){
    await updateTaskProgess(data);
    let temp = [...taskState];
    temp[id] = data;
    setTaskState(temp);
  }
  
  useEffect(() => {
    getTasks();
  }, []);

  function renderTasks(){
    return taskState.map((d, idx) => <Task key={idx} id={idx} taskData={d} callback={updateTasks} />);
  }

  return(
  <>
    <h1>Task Page</h1>
    {renderTasks()}
  </>
  );
}

export default TaskPage;

