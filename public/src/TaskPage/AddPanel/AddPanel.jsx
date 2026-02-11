import { useState } from 'react'
import './AddPanel.css'


const AddPanel = ({addFunction, setActivePanel}) => {
  //const [title, setTitle] = useState('')
  //const [steps, setSteps] = useState('')
  const [err, setErr] = useState(false)
  const [errMsg, serErrMsg] = useState('')

  async function addTask(formData){
    const title = formData.get('title')
    const steps = formData.get('steps')
    const [ret, response] = await addFunction(title, steps);
    setActivePanel(!ret);
    setErr(!ret)
    if(!ret){serErrMsg(response.message)}
  }
  

  return(
  <div className="background">
    <h1 className="title">Add Task</h1>
    {err && <h3 className="error">{errMsg}</h3>}
    <form action={addTask}>
      <div className="Field">
        <h3 className="title">Title</h3>
        <input
          name="title"
          required
          /*onChange={(e) => setTitle(e.target.value)}*/>
        </input>
      </div>
      <div className="Field">
        <h3 className="title">Steps</h3>
        <input
          name="steps" 
          type="number"
          min="1"
          required
          /*onChange={(e) => setSteps(e.target.value)}*/>
        </input>
      </div>
      <br/>
      <br/>
      <button type="submit">Add</button>
    </form>

  </div>
  );


}


export default AddPanel;
