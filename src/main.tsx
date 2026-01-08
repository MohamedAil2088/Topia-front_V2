import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { CurrencyProvider } from './context/CurrencyContext'
import { store } from './redux/store'
import './index.css'
import './i18n'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </Provider>
  </StrictMode>,
)
