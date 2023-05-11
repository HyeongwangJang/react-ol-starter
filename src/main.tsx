import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import App from './App';
import Example01 from './page/Example01';
import Example02 from './page/Example02';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/example1',
    element: <Example01 />,
  },
  {
    path: '/example2',
    element: <Example02 />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
