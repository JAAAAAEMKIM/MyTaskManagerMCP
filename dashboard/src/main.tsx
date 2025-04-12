import './styles/globals.css';

import { createRoot } from 'react-dom/client';
import Dashboard from './components';
import React from 'react';

import initialProps from './__mocks__/mockData.json';

const div = document.getElementById('root');
if (div) {
  const root = createRoot(div);

  console.log(initialProps);
  root.render(<Dashboard {...initialProps} />);
}
