import React from 'react';
import { render } from '@testing-library/react';
import { App } from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Modal Progressions 1.1.2/i);
  expect(linkElement).toBeInTheDocument();
  const linkElement1 = getByText(/1-7-1/i);
  expect(linkElement1).toBeInTheDocument();
});
