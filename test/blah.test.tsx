import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as Builder } from '../stories/Builder.stories';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Builder />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
