import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createSequences, nextCandidate } from './ModProg';

import _ from 'lodash';

const sequences = createSequences(2, 1, 2, 2);

const ChordName = ['Maj7', 'm7', 'm7(b9)', 'Maj7(+11)', '7', 'm7(+5)', 'm7b5'];

function toName(sequence) {
  const names = _.map(sequence, s => ChordName[s - 1]);
  return names;
}

function Sequence({ sequence, priority }) {
  const names = toName(sequence);
  const fullNames = _.join(names, '; ');
  const ranks = _.join(sequence, '; ');
  return (<div>
    Priority: {priority} - {fullNames} <br />
    {ranks}
  </div>);
}

function Sequences({ sequences }) {
  return (
    <div>
      {_.map(sequences, sequence => Sequence(sequence))}
    </div>);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          <Sequences sequences={sequences} />
        </a>
      </header>
    </div>
  );
}

export default App;
