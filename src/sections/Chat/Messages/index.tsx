import React, { useEffect, useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { useImmer } from "use-immer";

import { SocketContext } from "util/socketProvider";
import { Message } from "store/types";
import MessageComponent from "./Message";

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
        <MessageComponent message={ eachMessage } />
      ))}
      {Object.values(state.drafts).map(eachMessage => (
        <MessageComponent message={ eachMessage } draft />
      ))}
    </ListGroup>
  );
};
