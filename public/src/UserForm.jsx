import { useState } from "react";
import { input_style } from "./styleclass"


const UserForm = ({form_action, register=false, notice=""}) =>{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  function form_action_middle(form_data){
    setUsername(form_data.get("username"));
    setPassword(form_data.get("password"));
    form_action(form_data);
  }


  return(
    <div class="flex flex-col gap-5 w-fit text-center p-5">
    {!register && <p class="mb-2">Enter your login credentials</p>}
    {register && <p class="mb-2">Create you account</p>}
    <form action={form_action_middle} class="flex flex-col items-center text-center">
    {(notice != "") && <label class="text-red-500">{notice}</label>}
    <input
    name="username"
    placeholder="Username"
    id="username"
    defaultValue={username}
    class={input_style}
    required
    />
    <input
    name="password"
    placeholder="Password"
    type="password"
    id="password"
    defaultValue={password}
    class={input_style}
    required
    />
    {register &&
      <>
      <input
      name="password_confirmation"
      placeholder="Password Confirmation"
      id="password_confirmation"
      type="password"
      class={input_style}
      required
      />
      </>
    }
    <button type="submit" class="bg-mauve-bark-600 text-white mt-4 p-4 pl-5 pr-5 pt-1 pb-1 rounded-xl transition duration 300 ease-out hover:bg-mauve-bark-700">Submit</button>
    </form>
    </div>
  );
}


export default UserForm;
