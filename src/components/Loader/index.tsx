import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  text?: string | null,
};

export default (props: Props) => {
  return (
    <>
      <FontAwesomeIcon icon='spinner' pulse /> { props.text || 'Loading' }
    </>
  );
};