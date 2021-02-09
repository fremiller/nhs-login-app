/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer';

it('renders correctly', () => {
  let root: renderer.ReactTestRenderer;
  act(()=>{
    root = renderer.create(<App />);
  });

  //@ts-ignore
  expect(root).toMatchSnapshot();
  //@ts-ignore
  root.unmount();
});
