import { addTaskApi, deleteTaskApi, updateTaskProgessApi, getTasksApi } from "./api"

let logged_in = false;

export async function getTasksController(){
  let data;
  let status;
  if(logged_in){
    [status, data] = await getTasksApi();
  }else{
    data = getLocalStorage(); 
    if(data){status=true;}
  }
  return [status, data];
}


export async function addTaskController(title, steps){
  let status;
  let data;
  if(logged_in){
    [status, data] = await addTaskApi(title, steps);
  }else{
    status = true;
    data = {title: title, steps: steps, id:0, progress:0}
  }
  return [status, data];
}

export async function updateTaskController(data){
  if(logged_in){
    await updateTaskProgessApi(data);
  }
}

export async function deleteTaskController(data_id){
    if(logged_in){
    await deleteTaskApi(data_id);
    }
}

export function getLocalStorage(){
  return JSON.parse(localStorage.getItem("tasks"));
}

export function setLocalStorage(data){
  localStorage.setItem("tasks", JSON.stringify(data));
}

