import './Login.css';
import { login } from './api';
import UserForm from './UserForm.jsx';
import { useState } from "react";
import { form_frame_style } from "./styleclass.jsx"


const Login = () => {
  const [notice, setNotice] = useState("");
  logged_redirect(JSON.parse(localStorage.getItem("logged")));

  function logged_redirect(logged){
    if(logged){
      window.location.href = "/";
    }
  }

   async function login_form(form_data){
     let [logged, data] = await login(form_data);
     if(logged){
       logged_redirect(logged);
     }
     setNotice(data.detail);
  }


  return (
    <div class="flex h-screen bg-ivory-mist-100">
    <div class={form_frame_style}>
    <UserForm form_action={login_form} notice={notice}/>
    <a href="/" class="text-blue-600">Proceed without an account</a>
    <a href="/register" class="text-blue-600">Create Account</a>
    </div>
    </div>
  );
};

export default Login;
