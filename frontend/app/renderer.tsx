import React from 'react'
import ReactDOM from 'react-dom/client'
import appIcon from '@/resources/build/icon.png'
import { WindowContextProvider, menuItems } from '@/lib/window'
import { Routes, Route, HashRouter } from 'react-router-dom'
import App from './app'
import './styles/app.css'
import WelcomeKit from './pages/WelcomeKit'
import Dashboard from './pages/Dashboard'
import Table from './pages/Table'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import { store } from "./store/store"
import { Provider } from 'react-redux'
import { ChartsWrapper } from './pages/ChartWrapper'
import { LineChartDemo } from './components/charts/LineChart'
import { AreaChartDemo } from './components/charts/AreaChart'
import { BarChartDemo } from './components/charts/BarChart'
import { ColumnChartDemo } from './components/charts/ColumnChart'
import { PieChartDemo } from './components/charts/PieChart'
import MapGisOne from './pages/maps/MapGisOne'
import MapGisTwo from './pages/maps/MapGisTwo'


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
                  <Route path="table" element={<Table />} />

                  {/* Grouped Charts */}
                  <Route path="charts" element={<ChartsWrapper />}>
                    <Route path="linechart" element={<LineChartDemo />} />
                    <Route path="areachart" element={<AreaChartDemo />} />
                    <Route path="barchart" element={<BarChartDemo />} />
                    <Route path="coloumnchart" element={<ColumnChartDemo />} />
                    <Route path="piechart" element={<PieChartDemo />} />
                  </Route>
                  <Route path="maps">
                    <Route path="gis1" element={<MapGisOne />} />
                    <Route path="gis2" element={<MapGisTwo />} />
                  </Route>

                </Route>
              </Route>

            </Routes>
          </HashRouter>
        </WindowContextProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
)
