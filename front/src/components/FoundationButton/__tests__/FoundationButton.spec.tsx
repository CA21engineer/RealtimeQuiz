import React from 'react';
import renderer from 'react-test-renderer';
import { FoundationButton } from '../FoundationButton';

test('FoundationButton', () => {
  const component = renderer.create(
    <FoundationButton label="button label" onClick={() => console.log} />
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
