import { useState } from "react";


const UserForm = ({form_action, register=false, notice=""}) =>{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  function form_action_middle(form_data){
    setUsername(form_data.get("username"));
    setPassword(form_data.get("password"));
    form_action(form_data);
  }

  return(
    <div class="m-auto w-fit bg-gray-200 text-center">
    {!register && <p>Enter your login credentials</p>}
    {register && <p>Create you account</p>}
    <form action={form_action_middle} class="flex flex-col items-center text-center">
    {(notice != "") && <label class="text-red-500">{notice}</label>}
    <label for="username">Username</label>
    <input
    name="username"
    id="username"
    defaultValue={username}
    required
    />
    <label for="password">Password</label>
    <input
    name="password"
    type="password"
    id="password"
    defaultValue={password}
    required
    />
    {register &&
      <>
      <label for="password_confirmation">Password Confirmation</label>
      <input
      name="password_confirmation"
      id="password_confirmation"
      type="password"
      required
      />
      </>
    }
    <button type="submit" class="bg-blue-300 p-4 pt-1 pb-1 rounded-xl">Submit</button>
    </form>
    </div>
  );
}


export default UserForm;
