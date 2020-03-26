import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Message } from 'store/types';

type Props = {
  message: Message,
  draft?: boolean,
};

export default (props: Props) => {

  const userColor = `#${props.message.user.color}`;

  const style: any = {
    borderLeftWidth: "4px",
    borderLeftColor: userColor,
  };

  if (props.draft) {
    style.color = '#aaa';
  }

  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      key={props.message.id}
      style={ style }
    >
      {props.message.message}
      <span style={ { color: userColor } }>
        @{props.message.user.name}
      </span>
    </ListGroup.Item>
  );
};