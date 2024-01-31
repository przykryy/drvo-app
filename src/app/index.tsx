import React from 'react';
import { Calculator as TodoApp } from 'app/containers/Calculator/Calculator';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <TodoApp/>
));
