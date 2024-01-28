import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { App } from './app';
import { Offer } from './app/containers/Offer/OfferComponent';
import { HelpComponent } from './app/containers/App/HelpComponent';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/oferta",
    element: <Offer/>
  },
  {
    path: "/pomoc",
    element: <HelpComponent/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);