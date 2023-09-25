import ChatView from 'Frontend/views/chat/ChatView';
import MainLayout from 'Frontend/views/MainLayout.js';
import { lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

const AboutView = lazy(async () => import('Frontend/views/about/AboutView.js'));

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    handle: { title: 'Main' },
    children: [
      { path: '/', element: <ChatView />, handle: { title: 'Chat' } },
      { path: '/about', element: <AboutView />, handle: { title: 'About' } },
    ],
  },
];

export default createBrowserRouter(routes);
