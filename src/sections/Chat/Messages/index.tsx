import React, { useEffect, useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { useImmer } from "use-immer";

import { SocketContext } from "util/socketProvider";
import { Message } from "store/types";

type State = {
  messages: Message[],
};

export default () => {
  const [state, setState] = useImmer<State>({
    messages: [],
  });

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('message', (msg: string) => {
      console.log('message', msg);
      setState(draft => {
        draft.messages.push({
          id: draft.messages.length,
          msg,
          user: {
            uuid: '1',
            name: 'alex',
            color: 'eb0000',
          },
        });
      });
    });
  }, [socket, setState]);

  return (
    <ListGroup className='my-4'>
      { state.messages.map(eachMessage => (
        <ListGroup.Item key={ eachMessage.id } style={ { borderLeftWidth: '4px', borderLeftColor: `#${eachMessage.user.color}` } }>
          { eachMessage.msg }
        </ListGroup.Item>
      )) }
    </ListGroup>
  );
};
