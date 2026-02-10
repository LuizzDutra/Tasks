import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import TaskPage from './TaskPage/TaskPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="app/" element={<App />} />
        <Route path="app/page" element={<TaskPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
