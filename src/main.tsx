import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import { Calculator } from './app/containers/Calculator/Calculator';
import { Offer } from './app/containers/Offer/OfferComponent';
import { Layout } from 'app/containers/Layout/Layout';
import LandingPage from 'app/containers/Home/LandingPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, PaletteMode } from '@mui/material';
import getLPTheme from 'app/containers/Home/getLPTheme';
import AppAppBar from 'app/containers/Home/components/AppAppBar';
import { CalculatorMui } from 'app/containers/CalculatorMui/Calculator';

const router = createBrowserRouter([{
  element: <Layout />,
  children: [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/kalkulator",
      children: [
        {
          path: "",
          element: <CalculatorMui />,
        },

      ]
    },
    {
      path: "oferta",
      element: <Offer />
    },
    {
      path: "*",
      element: <CalculatorMui />,
    }
  ]
}]);
const defaultTheme = createTheme({});

function App() {
  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };


  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <Container>
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <CssBaseline />
      <div></div>
      <RouterProvider router={router} />
      </Container>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);