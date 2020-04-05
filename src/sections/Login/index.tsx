import React from 'react';
import { Form, Container } from 'react-bootstrap';
import { useImmer } from 'use-immer';
import classNames from 'classnames';

import { useGlobalState } from 'store/state';
import { fetchResource } from 'util/fetch';
import Logo from 'components/Logo';

import styles from './index.module.scss';
import { AuthData } from 'store/types';

type State = {
  username: string,
  loading: boolean,
};

export default () => {
  const { dispatch } = useGlobalState();
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
    fetchResource('/auth', 'POST', body).then((data: AuthData) => {
      if (!data || !data.user.user_id) {
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
      console.log('login fail reason', reason);
      dispatch({
        type: 'error',
        payload: reason.errors.join(', '),
      })

      setState(draft => {
        draft.loading = false;
      });
    });
  };

  return (
    <Container className={ classNames(styles.login, 'mt-4') }>
      <Logo />
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