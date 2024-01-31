import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Calculator } from './app/containers/Calculator/Calculator';
import { Offer } from './app/containers/Offer/OfferComponent';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Calculator/>,
  },
  {
    path: "/oferta",
    element: <Offer/>
  },
  {
    path: "*",
    element: <Calculator/>,
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);