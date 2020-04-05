import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

import styles from './index.module.scss';

export default () => {
  return (
    <div className={ styles.passwordLock }>
      <OverlayTrigger
          placement='bottom'
          delay={ 500 }
          overlay={
            <Tooltip id='passwordLock'>
              Set a password to keep your username
            </Tooltip>
          }
        >
          <Button variant="link">
            <FontAwesomeIcon icon='lock-open' />
          </Button>
        </OverlayTrigger>
    </div>
  );
};