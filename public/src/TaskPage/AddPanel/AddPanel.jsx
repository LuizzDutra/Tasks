import { useState } from 'react'
import './AddPanel.css'
import { input_style } from "../../styleclass"


const AddPanel = ({addFunction, setActivePanel}) => {
  //const [title, setTitle] = useState('')
  //const [steps, setSteps] = useState('')
  const [err, setErr] = useState(false)
  const [errMsg, setErrMsg] = useState('Something went wrong')

  async function addTask(formData){
    const title = formData.get('title')
    const steps = formData.get('steps')
    const [ret, response] = await addFunction(title, steps);
    setActivePanel(!ret);
    setErr(!ret)
    if(!ret){
      setErrMsg(response.response.data.detail);
    }
  }
 

  return(
  <div class="absolute flex inset-0 justify-center items-center backdrop-blur-xs">
  <div class="flex flex-col w-fit p-5 rounded-xl text-2xl bg-ivory-mist-100 h-fit">
    <div class="grid grid-flow-col grid-cols-5 mb-2">
    <h1 class="font-bold col-start-2 col-end-5">Add Task</h1>
    <button class="col-start-5 justify-self-end w-10 h-10 bg-powder-blush-400 text-white rounded-xl p-1" onClick={() => setActivePanel(false)}>
    <p class="text-gray-200">&#x2715;</p>
    </button>
    </div>
    {<h3 class="text-red-500">{err && errMsg}</h3>}
    <form action={addTask} class="flex flex-col gap-5">
        <input class={ input_style }
          name="title"
          required
          placeholder="Title"
          /*onChange={(e) => setTitle(e.target.value)}*/>
        </input>
        <input class={ input_style + " mb-2"}
          name="steps" 
          type="number"
          min="1"
          placeholder="Steps" 
          required
          /*onChange={(e) => setSteps(e.target.value)}*/>
        </input>
      <br/>
      <br/>
      <button class="font-bold rounded-full drop-shadow-lg bg-mauve-bark-700 text-white p-2 pl-5 pr-5 transition duration 300 ease-out hover:scale-105" type="submit">Add</button>
    </form>

  </div>
  </div>
  );


}


export default AddPanel;
