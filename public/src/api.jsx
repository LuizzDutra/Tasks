import axios from "axios";
let apiUrl = import.meta.env.VITE_API_URL




export async function login(form_data){
  let status = false;
  let data;
  await axios.request({
    method: "post",
    url: apiUrl + "/login", 
    data: form_data,
    withCredentials: true
  }).then((response) => {status = true; data=response.data})
  .catch((error) => {data=error.response.data});
  localStorage.setItem("logged", status);
  return [status, data];
}

export async function register(form_data){
  let status = false;
  let data;
  await axios.request({
    method: "POST",
    url: apiUrl + "/register",
    data: form_data,
    withCredentials: true
  }).then((response) => {status = true; data=response.data})
  .catch((error) => {data=error.response.data});
  return [status, data];
}

export async function logOut(){
  await axios.request({
    method: "delete",
    url: apiUrl + "/login",
    withCredentials: true
  }).catch((error) => {if(error.status == 401){console.log("Invalid Token")}});
  localStorage.setItem("logged", false);
}

export async function refresh(){
  await axios.request({
    method: "get",
    url: apiUrl + "/refresh",
    withCredentials: true,
  }).catch((error) => {localStorage.setItem("logged", false); window.location.replace("/login")});
  
}


export function logged_in(){
  let logged = localStorage.getItem("logged");
  if(!logged){
    localStorage.setItem("logged", false);
    logged = false;
  }
  return JSON.parse(logged);
}

