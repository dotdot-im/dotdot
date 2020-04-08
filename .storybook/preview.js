import React from 'react';
import { addDecorator } from '@storybook/react';
import { Container } from 'react-bootstrap'

addDecorator(storyFn => {
  return (
    <Container>
      {storyFn()}
    </Container>
  );
});