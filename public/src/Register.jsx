import './Login.css';
import { register } from './api';
import UserForm from './UserForm';
import { useState } from 'react';
import { form_frame_style } from "./styleclass"

const Register = () => {
  const [notice, setNotice] = useState("")
  logged_redirect(JSON.parse(localStorage.getItem("logged")));

  function logged_redirect(logged){
    if(logged){
      window.location.replace("/");
    }
  }

  async function register_form(form_data){
    if(form_data.get("password") !== form_data.get("password_confirmation")){
      setNotice("Passwords do not match");
      return;
    }
    let [registered, data] = await register(form_data);
    setNotice(data.detail);
    if(registered){
      window.location.replace("/login");
    }
  }

  return (
    <div class="flex h-screen bg-ivory-mist-100">
    <div class={form_frame_style}>
    <UserForm form_action={register_form} register={true} notice={notice}/>
    <a href="/" class="text-blue-600">Proceed without an account</a>
    <a href="/login" class="text-blue-600">Already have an account</a>
    </div>
    </div>
  );
};

export default Register;
