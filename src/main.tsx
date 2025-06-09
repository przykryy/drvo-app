import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Calculator } from './app/containers/Calculator/Calculator';
import { Offer } from './app/containers/Offer/OfferComponent';
import CalculatorV2 from 'app/containers/CalculatorV2/calculator-v2';

// Konfiguracja routera z /schody jako główną ścieżką
const router = createBrowserRouter([
  {
    path: "/",
    element: <Calculator />,
  },
  {
    path: "/kalkulator",
    element: <Calculator />
  },
  {
    path: "/oferta",
    element: <Offer />
  },
  {
    path: "/params",
    element: <CalculatorV2 />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);