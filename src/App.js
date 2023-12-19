import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfirmProvider } from 'material-ui-confirm';
import theme from './ui/styles/mui-theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import CreateStakingPool from './pages/CreateStakingPool';
import StakeToKuutamoPool from './pages/StakeToKuutamoPool';
import Home from './pages/Home';
import Pools from './pages/Pools';
import Rewards from './pages/Rewards';
import Servers from './pages/Servers';
import NavPage from './pages/NavPage';
import Layout from './ui/components/Layout';
import NavPageLayout from './ui/components/NavPageLayout';
import AddServer from './pages/AddServer';
import Keys from './pages/Keys';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
// import OrderPage from './pages/OrderPage';
import SimpleLayoutWithNav from './ui/components/SimpleLayoutWithNav';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LayoutWithWalletAuth from './ui/components/LayoutWithWalletAuth';
import AlphaPage from './pages/Alpha';
import LayoutWithoutSidebar from './ui/components/LayoutWithoutSidebar';
import DownloadKeyDashboard from './pages/DownloadKeyDashboard';
import RunModalPage from './pages/RunModalPage';
import PagerDutyPage from './pages/PagerDuty';
import RunOrderPage from './pages/RunOrderPage';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import DebugPage from './pages/DebugPage';

export default function App({ isSignedIn, wallet }) {
  const [mode, setMode] = useState(localStorage.getItem('siteMode') || 'dark');

  const changeTheme = () => {
    setMode((mode) => {
      const val = mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('siteMode', val);
      return val;
    });
  };

  return (
    <ThemeProvider theme={theme(mode)}>
      <BrowserRouter>
        <ConfirmProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout
                  isSignedIn={isSignedIn}
                  wallet={wallet}
                  changeTheme={changeTheme}
                />
              }
            >
              <Route
                index
                element={<Home isSignedIn={isSignedIn} wallet={wallet} />}
              />
            </Route>
            <Route
              path="/"
              element={
                <LayoutWithWalletAuth
                  isSignedIn={isSignedIn}
                  wallet={wallet}
                  changeTheme={changeTheme}
                />
              }
            >
              <Route path="/debug" element={<DebugPage />} />
              <Route path="/pools" element={<Pools wallet={wallet} />} />
              <Route
                path="/pools/create"
                element={<CreateStakingPool wallet={wallet} />}
              />
              <Route
                path="/stake"
                element={<StakeToKuutamoPool wallet={wallet} />}
              />
              <Route path="/rewards" element={<Rewards wallet={wallet} />} />
              <Route path="/servers" element={<Servers />} />
              <Route path="/keys" element={<Keys />} />
              <Route path="/servers/add" element={<AddServer />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route
              path="/"
              element={
                <NavPageLayout
                  isSignedIn={isSignedIn}
                  wallet={wallet}
                  changeTheme={changeTheme}
                />
              }
            >
              <Route path="/navpage" element={<NavPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/forgot-password/:email/:token"
                element={<ResetPasswordPage />}
              />
              <Route
                path="/confirm/:email/:token"
                element={<ConfirmEmailPage />}
              />
            </Route>
            <Route
              path="/"
              element={
                <SimpleLayoutWithNav
                  isSignedIn={isSignedIn}
                  wallet={wallet}
                  changeTheme={changeTheme}
                />
              }
            >
              {/* <Route path="/order" element={<OrderPage />} /> */}
              <Route path="/order" element={<RunOrderPage />} />
            </Route>

            <Route
              path="/"
              element={
                <LayoutWithoutSidebar
                  isSignedIn={isSignedIn}
                  wallet={wallet}
                  changeTheme={changeTheme}
                />
              }
            >
              <Route path="/alpha/token" element={<AlphaPage />} />
              <Route path="/pools/data" element={<DownloadKeyDashboard />} />
              <Route path="/run-modal" element={<RunModalPage />} />
              <Route path="/duty-modal" element={<PagerDutyPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ConfirmProvider>
      </BrowserRouter>
      <CssBaseline />
    </ThemeProvider>
  );
}

