import { getCookie, addTaskApi, deleteTaskApi, updateTaskProgessApi, getTasksApi } from "./api"
import { refresh, logged_in} from "../api"
import { useState } from "react";




export async function getTasksController(){
  let data;
  let status;
  
  if(logged_in()){
    try{
      [status, data] = await getTasksApi();
    }catch(error){
      if(error.status == 401 || error.status == 422){
        await refresh();
        [status, data] = await getTasksApi();
      }
    }
  }else{
    data = getLocalStorage(); 
    if(data){
      status=true;
    }else{
      setLocalStorage([]);
    }
  }
  return [status, data];
}


export async function addTaskController(title, steps){
  let status = false;
  let data;
  if(logged_in()){
    try{
      [status, data] = await addTaskApi(title, steps);
    }catch(error){
      if(error.status == 401 || error.status == 422){
        await refresh();
        [status, data] = await addTaskApi(title, steps);
      }else{
        data = error;
      }
    }
  }else{
    status = true;
    data = {title: title, steps: steps, id:0, progress:0}
  }
  return [status, data];
}

export async function updateTaskController(data){
  let status = false;
  if(logged_in()){
    try{
      data = await updateTaskProgessApi(data);
      status = true;
    } catch(error){
      if(error.status == 401 || error.status == 422){
        await refresh();
        data = await updateTaskProgessApi(data);
        status = true;
      }
    }
  }else{status = true;}
  return [status, data];
}

export async function deleteTaskController(data_id){
  let status = false;
    if(logged_in()){
      try{
        await deleteTaskApi(data_id);
        status = true;
      }catch(error){
        if(error.status == 401 || error.status == 422){
          await refresh();
          await deleteTaskApi(data_id);
          status = true;
        }
      }
    }else{status=true}
  return status; 
}

export function getLocalStorage(){
  return JSON.parse(localStorage.getItem("tasks"));
}

export function setLocalStorage(data){
  localStorage.setItem("tasks", JSON.stringify(data));
}

