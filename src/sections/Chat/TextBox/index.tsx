import React, { useContext } from "react";
import { Form } from "react-bootstrap";
import { useImmer } from "use-immer";

import { SocketContext } from "util/socketProvider";

type State = {
  message: string,
};

export default () => {
  const [state, setState] = useImmer<State>({
    message: '',
  });

  const { emit } = useContext(SocketContext);

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    emit('message', state.message);

    setState(draft => {
      draft.message = '';
    });
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Group controlId="chatForm.message">
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="input"
          type="text"
          onChange={e => {
            const value = e.currentTarget.value;
            setState(draft => { draft.message = value });
          }}
          value={ state.message }
        />
      </Form.Group>
    </Form>
  );
};
