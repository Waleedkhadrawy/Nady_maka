import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/components/Buttons.css';
import './styles/components/Cards.css';
import './styles/components/sections.css';
import './styles/components/Images.css';
import './styles/components/Typography.css';
import './styles/components/Layout.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const container =
  document.getElementById('root') ||
  (() => {
    const el = document.createElement('div');
    el.id = 'root';
    document.body.appendChild(el);
    return el;
  })();
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);