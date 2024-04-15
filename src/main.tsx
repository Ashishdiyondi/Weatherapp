// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
// ///////////

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter and Route
import App from "./App.tsx";
import CityDetail from "../src/Citydetail.tsx";
// import WeatherDetail from "./WeatherDetail.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap your App component with BrowserRouter */}
      {/* <App />
      <Route path="/city/:cityName" element={<CityDetail />} /> */}
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/city/:cityName" element={<WeatherDetail />} /> */}
        <Route path="/city/:cityName" element={<CityDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
