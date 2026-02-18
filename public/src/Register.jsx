import './App.css';
import { register } from './api';

const Register = () => {
  logged_redirect(JSON.parse(localStorage.getItem("logged")));

  function logged_redirect(logged){
    if(logged){
      window.location.replace("/");
    }
  }

   async function register_form(form_data){
     let registered = await register(form_data);
     if(registered){
       window.location.replace("/login");
     }
  }

  return (
    <div>
    <form action={register_form}>
      <label>Username
      <input
        name="username"
        type="text"
      />
      </label>
      <label>Password
      <input
        name="password"
        type="password"
      />
      </label>
      <button type="submit" class="bg-red-500">Submit</button>
    </form>
    </div>

  );
};

export default Register;
