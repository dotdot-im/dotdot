import React from 'react';
import classNames from 'classnames';
import { Message } from 'store/types';

import styles from './index.module.scss';

type Props = {
  message: Message,
  draft?: boolean,
};

export default (props: Props) => {

  const userColor = `#${props.message.user.color}`;

  const style: any = {
    borderLeft: `solid 5px ${userColor}`,
  };

  if (props.draft) {
    style.color = '#aaa';
  }

  return (
    <div
      className={ classNames(styles.message, "d-flex justify-content-between align-items-center") }
      key={props.message.id}
      style={ style }
    >
      {props.message.message}
      <span style={ { color: userColor } }>
        @{props.message.user.name}
      </span>
    </div>
  );
};