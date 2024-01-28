import React from 'react';
import { App as TodoApp } from 'app/containers/App/App';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <TodoApp/>
));
