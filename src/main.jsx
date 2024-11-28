import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import store from "./features/Store.js";
import { Provider } from "react-redux"
import './index.css'
import { register } from "swiper/element/bundle"
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

register()


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
