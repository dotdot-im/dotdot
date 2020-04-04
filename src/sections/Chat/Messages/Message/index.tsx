import React from 'react';
import classNames from 'classnames';
import { Message } from 'store/types';

import styles from './index.module.scss';
import useGlobalState from 'store/state';

type Props = {
  message: Message,
  draft?: boolean,
};

export default (props: Props) => {
  const { state } = useGlobalState();

  const userColor = `#${props.message.user.color}`;

  const style: any = {
    borderLeft: `solid 5px ${userColor}`,
  };

  if (props.draft) {
    style.color = '#aaa';
  }

  return (
    <div
      className={ classNames(styles.message) }
      key={props.message.id}
      style={ style }
    >
      {props.message.message}
      <span className={ classNames(styles.user, { [styles.op]: props.message.user.user_id === state.auth.user?.user_id }) }>
        <i>@</i>{props.message.user.name}
      </span>
      <div className={ classNames(styles.dots) } style={ { backgroundColor: userColor } } />
    </div>
  );
};