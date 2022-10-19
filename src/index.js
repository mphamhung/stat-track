import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route} from "react-router-dom";
// import { Switch } from 'react-router';
import LandingPage from './LandingPage';
import TopBar from './components/TopBar';
import AdminPage from './AdminPage';
import SummaryPage  from './SummaryPage'
import FeedbackPage from './FeedbackPage';
import TeamPage from './TeamPage';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <TopBar/>
      <Routes path="/" >
        <Route index element={<LandingPage/>} />
        <Route path='game' element={<App/>}/>
        <Route path='admin' element={<AdminPage/>}/>
        <Route path='summary' element={<SummaryPage/>}/>
        <Route path='feedback' element={<FeedbackPage />}/>
        <Route path='team' element={<TeamPage />} />
      </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
