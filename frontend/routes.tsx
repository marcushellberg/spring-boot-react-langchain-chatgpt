import ChatView from 'Frontend/views/chat/ChatView';
import MainLayout from 'Frontend/views/MainLayout.js';
import { lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import StreamingChatView from "Frontend/views/streaming-chat/StreamingChatView";


export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    handle: { title: 'Main' },
    children: [
      { path: '/', element: <ChatView />, handle: { title: 'Chat' } },
      { path: '/streaming', element: <StreamingChatView />, handle: { title: 'Streaming Chat' } },
    ],
  },
];

export default createBrowserRouter(routes);
