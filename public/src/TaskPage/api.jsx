import axios from "axios";


let apiUrl = import.meta.env.VITE_API_URL


export async function getTasksApi(){
  let data = null;
  let status = false;
  await axios.get(`${apiUrl}/tasks`)
    .then((response) => {data = response.data; status=true});
  return [status, data];
}

export async function updateTaskProgessApi(data){
  await axios.patch(`${apiUrl}/tasks?id=${data.id}&field=progress&val=${data.progress}`);
}

export async function deleteTaskApi(id){
  await axios.delete(`${apiUrl}/tasks?id=${id}`);
}

export async function addTaskApi(title, steps){
  let data;
  let status;
  await axios.post(`${apiUrl}/tasks?title=${title}&steps=${steps}`)
    .then((response) => {
      status = true;
      data = response.data;
    })
    .catch((error) => {
      status = false;
      data = error;
    }
    );

  return [status, data];
}


