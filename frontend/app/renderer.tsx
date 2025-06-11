import React from 'react'
import ReactDOM from 'react-dom/client'
import appIcon from '@/resources/build/icon.png'
import { WindowContextProvider, menuItems } from '@/lib/window'
import { Routes, Route, HashRouter } from 'react-router-dom'
import App from './app'
import './styles/app.css'
import WelcomeKit from './pages/WelcomeKit'
import Dashboard from './pages/Dashboard'
import Charts from './pages/Charts'
import Table from './pages/Table'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import { store } from "./store/store"
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>

        <WindowContextProvider
          titlebar={{ title: 'Electron React App', icon: appIcon, menuItems }}
        >
          <HashRouter>
            <Routes>
              <Route path="login" element={<LoginPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<App />}>
                  <Route index element={<Dashboard />} />
                  <Route path="onboarding" element={<WelcomeKit />} />
                  <Route path="charts" element={<Charts />} />
                  <Route path="table" element={<Table />} />
                </Route>
              </Route>
            </Routes>
          </HashRouter>
        </WindowContextProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
)
