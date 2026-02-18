import './App.css';
import { login } from './api';

const Login = () => {
  logged_redirect(JSON.parse(localStorage.getItem("logged")));

  function logged_redirect(logged){
    if(logged){
      window.location.replace("/");
    }
  }

   async function login_form(form_data){
     let logged = await login(form_data);
     logged_redirect(logged);
  }

  return (
    <div>
    <form action={login_form}>
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

export default Login;
