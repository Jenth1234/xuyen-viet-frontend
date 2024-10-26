import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import 'leaflet/dist/leaflet.css'; 
import App from './App';
import reportWebVitals from './reportWebVitals';

import '@fortawesome/fontawesome-free/css/all.min.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
  
);


reportWebVitals();
