import React, { useState } from "react";
import { Container, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useImmer } from "use-immer";

import "./index.scss";

type Message = {
  id: number,
  msg: string,
  user: string,
  color: string,
};

type State = {
  message: string,
  messages: Message[],
};

export default () => {
  const [state, setState] = useImmer<State>({
    message: '',
    messages: [],
  });

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    setState(draft => {
      draft.messages.push({
        id: draft.messages.length,
        msg: state.message,
        user: 'alex',
        color: 'eb0000',
      });
      draft.message = '';
    });
  };

  return (
    <Container>
      <section>
        <ListGroup className='my-4'>
          { state.messages.map(eachMessage => (
            <ListGroup.Item key={ eachMessage.id } style={ { borderLeftWidth: '4px', borderLeftColor: `#${eachMessage.color}` } }>
              { eachMessage.msg }
            </ListGroup.Item>
          )) }
        </ListGroup>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="exampleForm.ControlTextarea1">
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
      </section>
    </Container>
  );
};
