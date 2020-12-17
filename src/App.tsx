import React, { FunctionComponent } from 'react';
import './App.css';
import { ProgPane } from './ProgPane';
import 'bootstrap/dist/css/bootstrap.min.css';

export const App: FunctionComponent<{}> = () => {
  return (
    <div>
      <ProgPane />
    </div>
  );
};
