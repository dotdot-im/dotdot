import React from "react";

import { useStateValue } from "store/state";
import styles from './index.module.scss';

export default () => {
  const { state } = useStateValue();

  if (!state.offline) {
    return null;
  }

  return (
    <div className={ styles.offline }>
      You seem to be offline! Please try again later
    </div>
  );
};
