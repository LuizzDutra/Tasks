import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [count, setCount] = useState(0);
  const [serverText, setServerText] = useState('');

  async function getServerText(){
    let request;
    await fetch('http://localhost:8000/api/greet/', {method: 'GET'})
      .then((response) => response.json())
      .then((json) => {request = json});
    setServerText(request.data);
  }

  function onButtonClick(){
    setCount(count+1);
    getServerText();
  }


  return (

    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Vite + React</h1>
        <p>
          <button onClick={onButtonClick}>
            count is {count}
          </button>
        </p>
        <p>
          {serverText}
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
};

export default App;
