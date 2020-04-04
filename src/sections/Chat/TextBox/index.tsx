import React, { useContext, useRef } from "react";
import { Form } from "react-bootstrap";
import { useImmer } from "use-immer";

import { SocketContext } from "util/socketProvider";
import styles from './index.module.scss';

type State = {
  message: string,
};

export default () => {
  const [state, setState] = useImmer<State>({
    message: '',
  });
  const draftTimer = useRef<any>(null)

  const { socket } = useContext(SocketContext);

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    socket?.emit('message', {
      message: state.message,
    });

    setState(draft => {
      draft.message = '';
    });
  };

  const sendDraft = (message: string) => {
    socket?.emit('draft', {
      message,
    });
  };

  const onType = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    clearTimeout(draftTimer.current);

    const value = e.currentTarget.value;
    setState(draft => {
      draft.message = value;
    });

    draftTimer.current = setTimeout(() => {
      sendDraft(value);
    }, 100);
  };

  return (
    <Form noValidate onSubmit={handleSubmit} className={ styles.textBox }>
      <Form.Group controlId="chatForm.message">
        <Form.Control
          as="input"
          type="text"
          placeholder='Message...'
          autoFocus
          onChange={ onType }
          value={ state.message }
        />
      </Form.Group>
    </Form>
  );
};
