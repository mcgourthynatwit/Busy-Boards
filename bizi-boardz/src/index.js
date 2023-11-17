import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Login from './pages/Login';
import CurrentSprint from './pages/CurrentSprint.js';
import ViewBacklog from './pages/ViewBacklog.js';
import MyTasks from './pages/MyTasks.js';
import Settings from './pages/Settings.js';
import reportWebVitals from './reportWebVitals';
import '@fortawesome/fontawesome-svg-core/styles.css';

//<Route path='/contact' element={<Contact />} />

export default function App() {
  return (
    <> 
      <NavigationBar />
        <Routes>
          <Route path="/">
            <Route index element={<Login />} />
            <Route path="/currentSprint" element={<CurrentSprint />} />
            <Route path='/viewBacklog' element={<ViewBacklog />} />
            <Route path='/myTasks' element={<MyTasks />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
        </Routes>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
