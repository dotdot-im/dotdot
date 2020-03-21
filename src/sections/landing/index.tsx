import React, { useState, useEffect } from "react";
import { Container, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useImmer } from "use-immer";
import socketio from 'socket.io-client';

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

const io = socketio('http://localhost:8080');

export default () => {
  const [state, setState] = useImmer<State>({
    message: '',
    messages: [],
  });

  useEffect(() => {
    console.log('adding io handlers', io);
    io.on('connection', (socket: SocketIOClient.Socket) => {
      console.log('connected');
      setState(draft => {
        draft.messages.push({
          id: draft.messages.length,
          msg: 'Connected',
          user: 'server',
          color: 'ccc',
        });
      });

      socket.on('message', (msg: string) => {
        console.log('message', msg);
        setState(draft => {
          draft.messages.push({
            id: draft.messages.length,
            msg,
            user: 'alex',
            color: 'eb0000',
          });
        });
      });
    });
  }, [setState]);

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    io.emit('message', state.message);

    setState(draft => {
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
