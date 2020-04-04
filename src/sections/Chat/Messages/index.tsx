import React, { useEffect, useContext, useRef } from "react";
import { useImmer } from "use-immer";
import classNames from "classnames";

import { SocketContext } from "util/socketProvider";
import { Message } from "store/types";
import MessageComponent from "./Message";

import styles from './index.module.scss';

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

  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatAreaRef || !chatAreaRef.current) {
      return;
    }
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [state.messages]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("message", (payload: Message) => {
      // check if the last one was by the same user
      setState(draft => {
        // delete draft from this user
        delete draft.drafts[payload.user.user_id];

        const lastMessage = draft.messages[draft.messages.length - 1];
        if (lastMessage && lastMessage.user.user_id === payload.user.user_id) {
          lastMessage.message += `\n${payload.message}`;
          return;
        }

        draft.messages.push({
          id: draft.messages.length,
          message: payload.message,
          user: payload.user
        });

      });
    });

    socket.on("draft", (payload: Message) => {
      setState(draft => {
        if (payload.message.trim().length < 1) {
          delete draft.drafts[payload.user.user_id];
          return;
        }
        draft.drafts[payload.user.user_id] = payload;
      });
    });
  }, [socket, setState]);

  return (
    <div className={ classNames(styles.messages, "my-4") } ref={ chatAreaRef }>
      {state.messages.map(eachMessage => (
        <MessageComponent key={ eachMessage.id } message={ eachMessage } />
      ))}
      {Object.values(state.drafts).map(eachMessage => (
        <MessageComponent key={ eachMessage.id } message={ eachMessage } draft />
      ))}
    </div>
  );
};
