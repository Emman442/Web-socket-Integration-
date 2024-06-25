import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import  { SocketProvider } from "./contexts/SocketContext.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
   
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
        </SocketProvider>
    </Provider>
  </React.StrictMode>

);
