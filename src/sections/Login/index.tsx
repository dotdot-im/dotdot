import React from 'react';
import { Form, Container } from 'react-bootstrap';

import { useStateValue } from 'store/state';
import { fetchResource } from 'util/fetch';
import { useImmer } from 'use-immer';

type State = {
  username: string,
};

export default () => {
  const { dispatch } = useStateValue();
  const [localState, setState] = useImmer<State>({
    username: '',
  });

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    const body = {
      username: localState.username,
    };
    fetchResource('/auth', 'POST', body).then(data => {
      if (!data || !data.user.uuid) {
        console.warn('Invalid user object');
        dispatch({
          type: 'login',
          payload: null,
        })
        return;
      }

      dispatch({
        type: 'login',
        payload: data,
      })
    }).catch(reason => {
      dispatch({
        type: 'offline',
        payload: null,
      })

      dispatch({
        type: 'login',
        payload: null,
      })
    });
  };

  return (
    <Container className='mt-4'>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="loginForm.username">
          <Form.Label>User name</Form.Label>
          <Form.Control
            as="input"
            type="text"
            onChange={e => {
              const value = e.currentTarget.value;
              setState(draft => { draft.username = value });
            }}
            value={ localState.username }
          />
        </Form.Group>
      </Form>
    </Container>
  );
};