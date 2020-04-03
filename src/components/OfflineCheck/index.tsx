import React from "react";

import { useGlobalState } from "store/state";
import styles from './index.module.scss';

export default () => {
  const { state } = useGlobalState();

  if (!state.offline && !state.error) {
    return null;
  }

  if (state.error) {
    return (
      <div className={ styles.offline }>
        Error: {state.error}
      </div>
    );
  }

  return (
    <div className={ styles.offline }>
      You seem to be offline! Please try again later
    </div>
  );
};
