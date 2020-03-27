import React from 'react';
import { Form, Container } from 'react-bootstrap';

import { useStateValue } from 'store/state';
import { fetchResource } from 'util/fetch';
import { useImmer } from 'use-immer';

type State = {
  username: string,
  loading: boolean,
};

export default () => {
  const { dispatch } = useStateValue();
  const [localState, setState] = useImmer<State>({
    username: '',
    loading: false,
  });

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    if (localState.loading) {
      return;
    }

    setState(draft => {
      draft.loading = true;
    });

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

      setState(draft => {
        draft.loading = false;
      });
    });
  };

  return (
    <Container className='mt-4'>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="loginForm.username">
          <Form.Control
            as="input"
            type="text"
            placeholder="What's your name?"
            disabled={ localState.loading }
            autoFocus
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