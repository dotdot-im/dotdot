import React, { useEffect, useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { useImmer } from "use-immer";

import { SocketContext } from "util/socketProvider";
import { Message } from "store/types";

type State = {
  messages: Message[];
  drafts: {
    [key: string]: Message;
  };
};

export default () => {
  const [state, setState] = useImmer<State>({
    messages: [],
    drafts: {}
  });

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("message", (payload: Message) => {
      setState(draft => {
        draft.messages.push({
          id: draft.messages.length,
          message: payload.message,
          user: payload.user
        });
        // delete draft from this user
        delete draft.drafts[payload.user.uuid];
      });
    });

    socket.on("draft", (payload: Message) => {
      setState(draft => {
        if (payload.message.trim().length < 1) {
          delete draft.drafts[payload.user.uuid];
          return;
        }
        draft.drafts[payload.user.uuid] = payload;
      });
    });
  }, [socket, setState]);

  return (
    <ListGroup className="my-4">
      {state.messages.map(eachMessage => (
        <ListGroup.Item
          className="d-flex justify-content-between align-items-center"
          key={eachMessage.id}
          style={{
            borderLeftWidth: "4px",
            borderLeftColor: `#${eachMessage.user.color}`
          }}
        >
          {eachMessage.message}
          <span className="text-muted">{eachMessage.user.name}</span>
        </ListGroup.Item>
      ))}
      {Object.values(state.drafts).map(eachMessage => (
        <ListGroup.Item
          className="d-flex justify-content-between align-items-center"
          key={eachMessage.id}
          style={{
            color: "#aaa",
            borderLeftWidth: "4px",
            borderLeftColor: `#${eachMessage.user.color}`
          }}
        >
          {eachMessage.message}
          <span className="text-muted">{eachMessage.user.name}</span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
