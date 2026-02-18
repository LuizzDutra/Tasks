import axios from "axios";


let apiUrl = import.meta.env.VITE_API_URL


export function getCookie(key) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : null;
}

export async function getTasksApi(){
  let data = null;
  let status = false;
  await axios.request({
    method: "GET",
    url: `${apiUrl}/tasks`, 
    withCredentials: true
  })
    .then((response) => {data = response.data; status=true});
  return [status, data];
}

export async function updateTaskProgessApi(data){
  await axios.request({
    method: "PATCH",
    url:`${apiUrl}/tasks?id=${data.id}&field=progress&val=${data.progress}`,
    withCredentials: true,
  });
  return data; 
}

export async function deleteTaskApi(id){
  await axios.request({
    method: "DELETE",
    url:`${apiUrl}/tasks?id=${id}`,
    withCredentials: true
  });
}

export async function addTaskApi(title, steps){
  let data;
  let status;
  await axios.request({
    method:"POST",
    url: `${apiUrl}/tasks?title=${title}&steps=${steps}`,
    withCredentials: true
  })
    .then((response) => {
      status = true;
      data = response.data;
    })
  return [status, data];
}


