import './Login.css';
import { register } from './api';
import UserForm from './UserForm';
import { useState } from 'react';

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
    <div class="flex h-screen">
    <div class="flex flex-col m-auto bg-gray-300 items-center">
    <UserForm form_action={register_form} register={true} notice={notice}/>
    <a href="/" class="text-blue-600">Proceed without an account</a>
    <a href="/login" class="text-blue-600">Already have an account</a>
    </div>
    </div>
  );
};

export default Register;
