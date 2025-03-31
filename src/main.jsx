import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import store from "./features/Store.js";
import { Provider } from "react-redux"
import { register } from "swiper/element/bundle"
import './index.css'
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
// import DeveloperScreen from './DeveloperScreen.jsx';

register()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
