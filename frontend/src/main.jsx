import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import store from './redux/store.js'
import { Provider } from 'react-redux'

const root = createRoot(document.getElementById('root'));
window.store = store; // Expose store for axios interceptors

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
