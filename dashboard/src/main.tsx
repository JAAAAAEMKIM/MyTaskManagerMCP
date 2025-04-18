import './styles/globals.css';

import { createRoot } from 'react-dom/client';
import Dashboard from './components';
import React from 'react';

import initialProps from './__mocks__/mockData.json';
import { DoorayTasksResponse } from './types';

const div = document.getElementById('root');
if (div) {
  const root = createRoot(div);

  console.log(initialProps);
  root.render(
    <Dashboard
      tasksData={initialProps.tasksData as unknown as DoorayTasksResponse}
      title={initialProps.title}
    />
  );
}
