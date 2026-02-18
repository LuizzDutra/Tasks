import { useState } from 'react'
import './AddPanel.css'


const AddPanel = ({addFunction, setActivePanel}) => {
  //const [title, setTitle] = useState('')
  //const [steps, setSteps] = useState('')
  const [err, setErr] = useState(false)
  const [errMsg, serErrMsg] = useState('Something went wrong')

  async function addTask(formData){
    const title = formData.get('title')
    const steps = formData.get('steps')
    const [ret, response] = await addFunction(title, steps);
    setActivePanel(!ret);
    setErr(!ret)
  }
 
  const titleStyle = "font-bold text-xl";
  const inputStyle = "bg-gray-200 border-1 border-solid rounded-full p-1";

  return(
  <div class="background">
    <h1 class="font-bold text-2xl">Add Task</h1>
    {<h3 class="text-red-500">{err && errMsg}</h3>}
    <form action={addTask}>
      <div className="Field">
        <h3 class={ titleStyle }>Title</h3>
        <input class={ inputStyle }
          name="title"
          required
          /*onChange={(e) => setTitle(e.target.value)}*/>
        </input>
      </div>
      <div className="Field">
        <h3 class={ titleStyle }>Steps</h3>
        <input class={ inputStyle }
          name="steps" 
          type="number"
          min="1"
          required
          /*onChange={(e) => setSteps(e.target.value)}*/>
        </input>
      </div>
      <br/>
      <br/>
      <button class="font-bold rounded-full drop-shadow-lg bg-gray-300 p-2 pl-5 pr-5 transition duration 300 ease-out hover:scale-120" type="submit">Add</button>
    </form>

  </div>
  );


}


export default AddPanel;
