import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import classNames from 'classnames';

import { fetchResource } from 'util/fetch';
import { API_URL } from '../../../../constants';
import useGlobalState from 'store/state';

import styles from './index.module.scss';

export type Props = {
  show: boolean;
  onHide: () => void;
};

export default ({ show, onHide }: Props) => {
  const { state, dispatch } = useGlobalState();

  const [validated, setValidated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  let title = 'Claim Username';

  if (state.auth.user && state.auth.user.hasPassword) {
    title = 'Update Password';
  }

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      return;
    }

    const body = {
      password,
      repeatPassword,
    };

    fetchResource('/password', 'POST', body)
      .then(() => {
        dispatch({
          type: 'user_password',
          payload: true,
        });

        onHide();
        setValidated(false);
        setPassword('');
        setRepeatPassword('');
      })
      .catch((reason) => {
        dispatch({
          type: 'error',
          payload: reason.errors.join(', '),
        });
      });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="pwd.new">
            <Form.Control
              as="input"
              type="password"
              autoComplete="new-password"
              placeholder="Password..."
              autoFocus
              required
              minLength={6}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
              value={password}
            />
            <Form.Control.Feedback type="invalid">
              The password is too short. Minimum length is 6 characters.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="pwd.new">
            <Form.Control
              as="input"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat Password..."
              required
              minLength={6}
              pattern={password}
              onChange={(event) => {
                setRepeatPassword(event.currentTarget.value);
              }}
              value={repeatPassword}
            />
            <Form.Control.Feedback type="invalid">
              The passwords don't match!
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className={styles.footer}>
          <a
            href={`${API_URL}/logout`}
            className={classNames(styles.left, 'text-danger')}
          >
            Logout
          </a>

          <Button type="submit" variant="primary">
            Set password
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
